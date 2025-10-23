import fs from "fs";
import path from "path";
import { zodToJsonSchema } from "zod-to-json-schema";
import { PopoloPersonSchema } from "../schemas/person.popolo.schema";

const out = (p: string) => path.join(process.cwd(), p);
const ensureDir = (d: string) => fs.mkdirSync(d, { recursive: true });

type SchemaItem = { name: string; fileBase: string; zod: any; example?: any };

const SCHEMAS: SchemaItem[] = [
  {
    name: "PopoloPerson",
    fileBase: "person.popolo",
    zod: PopoloPersonSchema,
    example: {
      id: "john-q-public",
      name: "John Q. Public",
      other_names: [{ name: "John Public" }],
      identifiers: [{ scheme: "wikidata", identifier: "Q123" }],
      email: "john.public@example.org",
      gender: "male",
      pronouns: "he/him",
      birth_date: "1960-07-15",
      image: "https://example.org/john.jpg",
      summary: "Member of Parliament (2001–2010)",
      biography: "Longer biographical text…",
      national_identity: "CZ",
      contact_details: [{ type: "email", value: "constituency@example.org" }],
      links: [{ url: "https://en.wikipedia.org/wiki/John_Q_Public", note: "Wikipedia" }],
      sources: [{ url: "https://parliament.example.org/members/123" }],
      created_at: "2025-10-01T10:00:00Z",
      updated_at: "2025-10-10T12:00:00Z"
    }
  }
];

/** Write OpenAPI-friendly JSON Schema: no #/definitions, no $ref chains */
function writeJsonSchema(item: SchemaItem) {
  const json = zodToJsonSchema(item.zod, item.name, {
    target: "openApi3",
    $refStrategy: "none"
  });
  ensureDir(out("schemas"));
  fs.writeFileSync(out(`schemas/${item.fileBase}.json`), JSON.stringify(json, null, 2));
}

/** Minimal Markdown table + example */
function writeMarkdown(item: SchemaItem) {
  // crude field/description extractor for top-level object
  const shape = (item.zod as any)._def.shape();
  const rows = [
    "| Field | Type | Description |",
    "|---|---|---|"
  ];
  Object.keys(shape).forEach((key) => {
    const z: any = shape[key];
    const tn = (z._def?.typeName || z._def?.innerType?._def?.typeName || "unknown")
      .replace("Zod", "")
      .toLowerCase();
    const desc = z._def?.description || "";
    rows.push(`|\`${key}\`|${tn}|${desc}|`);
  });

  const md = `# Schema: ${item.name}

${rows.join("\n")}

## Example
\`\`\`json
${JSON.stringify(item.example ?? {}, null, 2)}
\`\`\`
`;
  fs.writeFileSync(out(`schemas/${item.fileBase}.md`), md);
}

// Run all generators
for (const s of SCHEMAS) {
  writeJsonSchema(s);
  writeMarkdown(s);
}
console.log("Generated: schemas/*.json, schemas/*.md");
