const fs = require("fs");
const path = require("path");
const $RefParser = require("@apidevtools/json-schema-ref-parser");

function titleFromJson(file) {
  try { return JSON.parse(fs.readFileSync(file,"utf8")).title; }
  catch { return null; }
}

function toKebab(s){ return s.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/\./g,"-").toLowerCase(); }

(async () => {
  const version = process.env.STD_VERSION || "latest";

  // 1) load & dereference all schemas in /schemas/*.json
  const files = fs.readdirSync("schemas").filter(f => f.endsWith(".json")).sort();
  const components = {};
  const paths = {};

  for (const f of files) {
    const full = path.join("schemas", f);
    const deref = await $RefParser.dereference(full);

    // prefer schema.title as component name; fallback to filename
    const title = titleFromJson(full) || path.basename(f, ".json");
    components[title] = deref;

    const slug = toKebab(title); // for the dummy path
    paths[`/_schemas/${slug}`] = {
      get: {
        summary: `Schema: ${title}`,
        responses: {
          "200": {
            description: "OK",
            content: { "application/json": { schema: { $ref: `#/components/schemas/${title}` } } }
          }
        }
      }
    };
  }

  // 2) assemble OpenAPI
  const spec = {
    openapi: "3.0.3",
    info: {
      title: "Legislature Data Standard",
      version,
      description: `Version **${version}**. ${Object.keys(components).length} schema(s).`
    },
    paths,
    components: { schemas: components }
  };

  fs.writeFileSync("openapi.json", JSON.stringify(spec, null, 2));
  console.log(`Wrote openapi.json (version ${version}) with ${files.length} schema(s).`);
})();
