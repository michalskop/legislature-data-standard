const fs = require("fs");
const $RefParser = require("@apidevtools/json-schema-ref-parser");

(async () => {
  const version = process.env.STD_VERSION || "latest";

  // Load and fully dereference the JSON Schema (removes $ref and definitions)
  const deref = await $RefParser.dereference("./schemas/person.popolo.json");

  const spec = {
    openapi: "3.0.3",
    info: {
      title: "Legislature Data Standard",
      version,
      description: `Version **${version}** of the standard. Includes a Popolo-compatible Person schema.`
    },
    paths: {
      "/_schemas/person": {
        get: {
          summary: "Schema: PopoloPerson (example endpoint)",
          description: "Dummy endpoint to expose the schema in Redoc.",
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/PopoloPerson" }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        PopoloPerson: deref
      }
    }
  };

  fs.writeFileSync("openapi.json", JSON.stringify(spec, null, 2));
  console.log(`Wrote openapi.json (version: ${version}) [dereferenced]`);
})();
