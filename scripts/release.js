const fs = require("fs");
const path = require("path");

const version = process.env.STD_VERSION || "latest";
const branch  = process.env.STD_BRANCH  || "";

function listFilesRecursive(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      out.push(...listFilesRecursive(full));
    } else if (ent.isFile()) {
      out.push(full);
    }
  }
  return out;
}

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
for (const full of listFilesRecursive("schemas")) {
  const name = path.basename(full);
  if (schemaFilter(full, name)) {
    fs.copyFileSync(full, path.join("stage", "schemas", name));
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
  function listBranchesRecursive(dir, baseRel = "") {
    const out = [];
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!ent.isDirectory()) continue;
      if (ent.name === "latest") continue;

      const rel = baseRel ? path.posix.join(baseRel, ent.name) : ent.name;
      const full = path.join(dir, ent.name);

      if (fs.existsSync(path.join(full, "latest", "index.html"))) {
        out.push(rel);
      }
      out.push(...listBranchesRecursive(full, rel));
    }
    return out;
  }

  const branches = listBranchesRecursive("dist")
    .filter(b => b !== "latest")
    .sort();

  const list = branches
    .map(b => `<li><a href="./${b}/latest/">${b}/latest</a></li>`)
    .join("\n");

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

// Write index.html pages for intermediate directories like dist/dt.analyses/
function generateIntermediateIndexes() {
  function listBranchesRecursive(dir, baseRel = "") {
    const out = [];
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!ent.isDirectory()) continue;
      if (ent.name === "latest") continue;

      const rel = baseRel ? path.posix.join(baseRel, ent.name) : ent.name;
      const full = path.join(dir, ent.name);

      if (fs.existsSync(path.join(full, "latest", "index.html"))) {
        out.push(rel);
      }
      out.push(...listBranchesRecursive(full, rel));
    }
    return out;
  }

  const branches = listBranchesRecursive("dist").sort();
  const parents = new Map();
  const hasLatest = new Set(branches);

  for (const b of branches) {
    const parts = b.split("/");
    if (parts.length < 2) continue;
    const parent = parts.slice(0, -1).join("/");
    const child = parts[parts.length - 1];
    if (!parents.has(parent)) parents.set(parent, new Set());
    parents.get(parent).add(child);
  }

  for (const [parent, children] of parents.entries()) {
    const fullDir = path.join("dist", parent);
    if (!fs.existsSync(fullDir)) continue;

    const list = Array.from(children)
      .sort()
      .map((c) => {
        const rel = `${parent}/${c}`;
        const href = hasLatest.has(rel) ? `./${c}/latest/` : `./${c}/`;
        const label = hasLatest.has(rel) ? `${c}/latest` : c;
        return `<li><a href="${href}">${label}</a></li>`;
      })
      .join("\n");

    const html = `<!DOCTYPE html>
  <html lang="en">
  <meta charset="utf-8">
  <title>${parent}</title>
  <body style="font-family: sans-serif; max-width: 700px; margin: 3em auto;">
    <h1>${parent}</h1>
    <ul>
      ${list}
    </ul>
    <p style="margin-top:2em;font-size:90%;color:#555;">
      <a href="../">Up</a> | <a href="/legislature-data-standard/">Home</a>
    </p>
  </body></html>`;

    fs.writeFileSync(path.join(fullDir, "index.html"), html);
  }
}
generateIntermediateIndexes();


rimraf("stage");
console.log(`Published branch=${branch} version=${version} to ${destVer} and ${destLatest}`);
