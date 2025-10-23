const fs = require("fs");
const path = require("path");

const version = process.env.STD_VERSION || "latest";
const dest = path.join("dist", version);

fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });

// choose JSON first, fallback to YAML
const specFile = fs.existsSync("openapi.json") ? "openapi.json"
               : fs.existsSync("openapi.yaml") ? "openapi.yaml"
               : null;
if (!specFile) {
  console.error("No openapi.json or openapi.yaml found. Run build:openapi first.");
  process.exit(1);
}

// copy root assets
for (const f of ["index.html", specFile]) {
  fs.copyFileSync(f, path.join(dest, f));
}

// copy schemas
fs.mkdirSync(path.join(dest, "schemas"), { recursive: true });
for (const f of fs.readdirSync("schemas")) {
  fs.copyFileSync(path.join("schemas", f), path.join(dest, "schemas", f));
}

// also publish latest/
if (version !== "latest") {
  const latest = path.join("dist", "latest");
  fs.mkdirSync(latest, { recursive: true });
  for (const f of ["index.html", specFile]) {
    fs.copyFileSync(path.join(dest, f), path.join(latest, f));
  }
  fs.mkdirSync(path.join(latest, "schemas"), { recursive: true });
  for (const f of fs.readdirSync(path.join(dest, "schemas"))) {
    fs.copyFileSync(path.join(dest, "schemas", f), path.join(latest, "schemas", f));
  }
}

console.log(`Prepared dist/${version} (and dist/latest) using ${specFile}`);
