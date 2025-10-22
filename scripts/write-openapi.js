const fs = require("fs");
const version = process.env.STD_VERSION || "latest";
const yaml = `openapi: 3.0.3
info:
  title: Legislature Data Standard
  version: ${version}
  description: |
    Version **${version}** of the standard. Includes a Popolo-compatible Person schema.

paths: {}

components:
  schemas:
    PopoloPerson:
      $ref: "./schemas/person.popolo.json"
`;
fs.writeFileSync("openapi.yaml", yaml);
console.log(`Wrote openapi.yaml (version: ${version})`);
