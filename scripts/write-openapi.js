const fs = require("fs");
const path = require("path");
const $RefParser = require("@apidevtools/json-schema-ref-parser");

const branch = process.env.STD_BRANCH || "";

function listSchemaJsonFiles(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      out.push(...listSchemaJsonFiles(full));
    } else if (ent.isFile()) {
      if (ent.name.endsWith(".json") && !ent.name.endsWith(".table.json")) {
        out.push(full);
      }
    }
  }
  return out;
}

function pickFiles(all) {
  if (branch === "popolo") {
    return all.filter(f => /\.popolo\.json$/.test(f));
  }
  if (branch === "dt") {
    return all.filter(f => /\.dt\.json$/.test(f));
  }
  if (branch.startsWith("dt.analyses/")) {
    const analysis = branch.slice("dt.analyses/".length);
    return all.filter(f => f === `${analysis}.dt.analyses.json`);
  }
  // default: include everything (fallback)
  return all;
}

function titleFromJson(file) {
  try { return JSON.parse(fs.readFileSync(file,"utf8")).title; }
  catch { return null; }
}

function toKebab(s){ return s.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/\./g,"-").toLowerCase(); }

function examplesForTitle(title) {
  if (title === "DtAnalysesCurrentTerm") {
    return {
      null: { summary: "Unknown current term", value: null },
      example: {
        summary: "Example current term",
        value: {
          id: "term-2025",
          name: "2025-",
          since: "2025-01-01",
          until: null,
          until_latest: "2029-12-31",
          identifiers: [{ scheme: "official", identifier: "10" }],
          note: "Example only"
        }
      }
    };
  }
  return null;
}

(async () => {
  const version = process.env.STD_VERSION || "latest";
  const filesAll = listSchemaJsonFiles("schemas")
    .map(f => f.replace(/\\/g, "/"))
    .sort();
  const files = pickFiles(filesAll.map(f => path.basename(f))).map(name => name);

  const selectedSet = new Set(files);
  const selectedFullPaths = filesAll.filter(full => selectedSet.has(path.basename(full)));

  const components = {};
  const paths = {};

  for (const full of selectedFullPaths) {
    const deref = await $RefParser.dereference(full);
    const title = titleFromJson(full) || path.basename(full, ".json");
    components[title] = deref;
    const fileName = path.basename(full);
    const examples = examplesForTitle(title);
    paths[`/schemas/${fileName}`] = {
      get: {
        summary: `Schema file: ${fileName}`,
        responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: `#/components/schemas/${title}` } } } } }
      }
    };

    if (examples) {
      paths[`/schemas/${fileName}`].get.responses["200"].content["application/json"].examples = examples;
    }
  }

  const spec = {
    openapi: "3.0.3",
    servers: [{ url: "." }],
    info: {
      title: "Legislature Data Standard",
      version,
      description: `Branch **${branch || "(none)"}**, version **${version}**. Includes ${Object.keys(components).length} schema(s).`
    },
    paths,
    components: { schemas: components }
  };

  fs.writeFileSync("openapi.json", JSON.stringify(spec, null, 2));
  console.log(`Wrote openapi.json for branch=${branch} version=${version} with ${selectedFullPaths.length} schema(s).`);
})();
