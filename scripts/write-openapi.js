const fs = require("fs");
const path = require("path");
const $RefParser = require("@apidevtools/json-schema-ref-parser");

const branch = process.env.STD_BRANCH || "";

function pickFiles(all) {
  if (branch === "popolo") {
    return all.filter(f => /\.popolo\.json$/.test(f));
  }
  if (branch.startsWith("dt")) {
    return all.filter(f => /\.popolo\.json$/.test(f) || /\.dt(\.|$)/.test(f));
  }
  // default: include everything (fallback)
  return all;
}

function titleFromJson(file) {
  try { return JSON.parse(fs.readFileSync(file,"utf8")).title; }
  catch { return null; }
}

function toKebab(s){ return s.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/\./g,"-").toLowerCase(); }

(async () => {
  const version = process.env.STD_VERSION || "latest";
  const filesAll = fs.readdirSync("schemas").filter(f => f.endsWith(".json")).sort();
  const files = pickFiles(filesAll);

  const components = {};
  const paths = {};

  for (const f of files) {
    const full = path.join("schemas", f);
    const deref = await $RefParser.dereference(full);
    const title = titleFromJson(full) || path.basename(f, ".json");
    components[title] = deref;
    const slug = toKebab(title);
    paths[`/_schemas/${slug}`] = {
      get: {
        summary: `Schema: ${title}`,
        responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: `#/components/schemas/${title}` } } } } }
      }
    };
  }

  const spec = {
    openapi: "3.0.3",
    info: {
      title: "Legislature Data Standard",
      version,
      description: `Branch **${branch || "(none)"}**, version **${version}**. Includes ${Object.keys(components).length} schema(s).`
    },
    paths,
    components: { schemas: components }
  };

  fs.writeFileSync("openapi.json", JSON.stringify(spec, null, 2));
  console.log(`Wrote openapi.json for branch=${branch} version=${version} with ${files.length} schema(s).`);
})();
