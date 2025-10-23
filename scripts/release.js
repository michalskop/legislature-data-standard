const fs = require("fs");
const path = require("path");

const version = process.env.STD_VERSION || "latest";
const branch  = process.env.STD_BRANCH  || "";

function copyTree(src, dst, filterFn = null) {
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    const s = path.join(src, f);
    const d = path.join(dst, f);
    const st = fs.lstatSync(s);
    if (st.isDirectory()) {
      copyTree(s, d, filterFn);
    } else {
      if (!filterFn || filterFn(s, f)) fs.copyFileSync(s, d);
    }
  }
}
function rimraf(p) { fs.rmSync(p, { recursive: true, force: true }); }

const specFile = fs.existsSync("openapi.json") ? "openapi.json"
               : fs.existsSync("openapi.yaml") ? "openapi.yaml"
               : null;
if (!specFile) { console.error("No openapi.json or openapi.yaml found."); process.exit(1); }

rimraf("stage");
fs.mkdirSync("stage/schemas", { recursive: true });
fs.copyFileSync("index.html", "stage/index.html");
fs.copyFileSync(specFile, `stage/${specFile}`);

// schema filter
const schemaFilter = (full, name) => {
  if (branch === "popolo") return /\.popolo\.json$/.test(name);
  if (branch.startsWith("dt")) return /\.popolo\.json$/.test(name) || /\.dt(\.|$)/.test(name);
  return true;
};

// copy only filtered schemas
for (const f of fs.readdirSync("schemas")) {
  if (schemaFilter(path.join("schemas", f), f)) {
    fs.copyFileSync(path.join("schemas", f), path.join("stage", "schemas", f));
  }
}

const destBase   = branch ? path.join("dist", branch) : "dist";
const destVer    = path.join(destBase, version);
const destLatest = path.join(destBase, "latest");

rimraf(destVer);   copyTree("stage", destVer);
rimraf(destLatest);copyTree("stage", destLatest);

// write branch-root redirect to latest (if branch)
if (branch) {
  const redirect = `<!DOCTYPE html><meta charset="utf-8"><title>Redirecting…</title><meta http-equiv="refresh" content="0; url=./latest/"><link rel="canonical" href="./latest/"><script>location.replace('./latest/' + location.hash);</script>`;
  fs.writeFileSync(path.join(destBase, "index.html"), redirect);
}

// always have a root index -> /latest/
const rootRedirect = `<!DOCTYPE html><meta charset="utf-8"><title>Redirecting…</title><meta http-equiv="refresh" content="0; url=./latest/"><link rel="canonical" href="./latest/"><script>location.replace('./latest/' + location.hash);</script>`;
fs.writeFileSync(path.join("dist", "index.html"), rootRedirect);

rimraf("stage");
console.log(`Published branch=${branch} version=${version} to ${destVer} and ${destLatest}`);
