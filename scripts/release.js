const fs = require("fs");
const path = require("path");

const version = process.env.STD_VERSION || "latest";
const branch  = process.env.STD_BRANCH  || ""; // e.g. "popolo", "dt", "dt.cz.psp"

/** copy src -> dst recursively */
function copyTree(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    const s = path.join(src, f);
    const d = path.join(dst, f);
    if (fs.lstatSync(s).isDirectory()) copyTree(s, d);
    else fs.copyFileSync(s, d);
  }
}
/** rm -rf path if exists */
function rimraf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

// choose spec
const specFile = fs.existsSync("openapi.json") ? "openapi.json"
               : fs.existsSync("openapi.yaml") ? "openapi.yaml"
               : null;
if (!specFile) {
  console.error("No openapi.json or openapi.yaml found. Run build:openapi first.");
  process.exit(1);
}

// stage current build
rimraf("stage");
fs.mkdirSync("stage/schemas", { recursive: true });
fs.copyFileSync("index.html", "stage/index.html");
fs.copyFileSync(specFile, `stage/${specFile}`);
for (const f of fs.readdirSync("schemas")) {
  fs.copyFileSync(path.join("schemas", f), path.join("stage", "schemas", f));
}

// targets
const destBase   = branch ? path.join("dist", branch) : "dist";
const destVer    = path.join(destBase, version);
const destLatest = path.join(destBase, "latest");

// refresh only this branch/version
rimraf(destVer);
copyTree("stage", destVer);

rimraf(destLatest);
copyTree("stage", destLatest);

// also publish convenience /latest at root when using branches
if (branch) {
  rimraf(path.join("dist", "latest"));
  copyTree("stage", path.join("dist", "latest"));

  // write a simple redirect at branch root -> branch/latest/
  const redirect = `<!DOCTYPE html>
<meta charset="utf-8">
<title>Redirecting…</title>
<meta http-equiv="refresh" content="0; url=./latest/">
<link rel="canonical" href="./latest/">
<script>location.replace('./latest/' + location.hash);</script>`;
  fs.writeFileSync(path.join(destBase, "index.html"), redirect);
}

// always have a root index -> /latest/
const rootRedirect = `<!DOCTYPE html>
<meta charset="utf-8">
<title>Redirecting…</title>
<meta http-equiv="refresh" content="0; url=./latest/">
<link rel="canonical" href="./latest/">
<script>location.replace('./latest/' + location.hash);</script>`;
fs.writeFileSync(path.join("dist", "index.html"), rootRedirect);

// cleanup stage
rimraf("stage");

console.log(`Published to ${destVer} and ${destLatest}${branch ? " (and /latest)" : ""} using ${specFile}`);

