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

rimraf(path.join("dist", "latest"));
copyTree("stage", path.join("dist", "latest"));

// write branch-root redirect to latest (if branch)
if (branch) {
  const redirect = `<!DOCTYPE html><meta charset="utf-8"><title>Redirecting…</title><meta http-equiv="refresh" content="0; url=./latest/"><link rel="canonical" href="./latest/"><script>location.replace('./latest/' + location.hash);</script>`;
  fs.writeFileSync(path.join(destBase, "index.html"), redirect);
}

// Always write a main index listing all branches & versions
function generateMainIndex() {
  const branches = fs.readdirSync("dist")
    .filter(f => fs.existsSync(path.join("dist", f, "latest", "index.html")))
    .filter(f => !["latest"].includes(f));

  const list = branches.map(b => 
    `<li><a href="./${b}/latest/">${b}/latest</a></li>`).join("\n");

  const html = `<!DOCTYPE html>
  <html lang="en">
  <meta charset="utf-8">
  <title>Legislature Data Standard</title>
  <body style="font-family: sans-serif; max-width: 700px; margin: 3em auto;">
    <h1>Legislature Data Standard</h1>
    <p>This repository hosts published JSON schemas and OpenAPI specs for Popolo and Data Times (DT) standards.</p>
    <ul>
      ${list}
      <li><a href="./latest/">latest (currently DT)</a></li>
    </ul>
    <p style="margin-top:2em;font-size:90%;color:#555;">
      Source: <a href="https://github.com/michalskop/legislature-data-standard">github.com/michalskop/legislature-data-standard</a>
    </p>
  </body></html>`;

  fs.writeFileSync(path.join("dist", "index.html"), html);
}
generateMainIndex();


rimraf("stage");
console.log(`Published branch=${branch} version=${version} to ${destVer} and ${destLatest}`);
