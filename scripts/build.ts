import fs from "fs";
import path from "path";
import { zodToJsonSchema } from "zod-to-json-schema";

import { PopoloPersonSchema } from "../schemas/person.popolo.schema";
import { PopoloOrganizationSchema } from "../schemas/organization.popolo.schema";
import { PopoloMembershipSchema } from "../schemas/membership.popolo.schema";
import { PopoloPostSchema } from "../schemas/post.popolo.schema";
import { PopoloContactDetailSchema } from "../schemas/contact-detail.popolo.schema";
import { PopoloNameComponentSchema } from "../schemas/name-component.popolo.schema";
import { PopoloMotionSchema } from "../schemas/motion.popolo.schema";
import { PopoloVoteEventSchema } from "../schemas/vote-event.popolo.schema";
import { PopoloCountSchema } from "../schemas/count.popolo.schema";
import { PopoloVoteSchema } from "../schemas/vote.popolo.schema";
import { PopoloAreaSchema } from "../schemas/area.popolo.schema";
import { PopoloEventSchema } from "../schemas/event.popolo.schema";
import { PopoloSpeechSchema } from "../schemas/speech.popolo.schema";


type SchemaItem = { name: string; fileBase: string; zod: any };

const SCHEMAS: SchemaItem[] = [
  { name: "PopoloPerson",       fileBase: "person.popolo",       zod: PopoloPersonSchema },
  { name: "PopoloOrganization", fileBase: "organization.popolo", zod: PopoloOrganizationSchema },
  { name: "PopoloMembership",   fileBase: "membership.popolo",   zod: PopoloMembershipSchema },
  { name: "PopoloPost",         fileBase: "post.popolo",         zod: PopoloPostSchema },
  { name: "PopoloContactDetail", fileBase: "contact-detail.popolo", zod: PopoloContactDetailSchema },
  { name: "PopoloNameComponent", fileBase: "name-component.popolo", zod: PopoloNameComponentSchema },
  { name: "PopoloMotion",        fileBase: "motion.popolo",        zod: PopoloMotionSchema },
  { name: "PopoloVoteEvent",     fileBase: "vote-event.popolo",    zod: PopoloVoteEventSchema },
  { name: "PopoloCount",         fileBase: "count.popolo",         zod: PopoloCountSchema },
  { name: "PopoloVote",          fileBase: "vote.popolo",          zod: PopoloVoteSchema },
  { name: "PopoloArea",          fileBase: "area.popolo",          zod: PopoloAreaSchema },
  { name: "PopoloEvent",         fileBase: "event.popolo",         zod: PopoloEventSchema },
  { name: "PopoloSpeech",        fileBase: "speech.popolo",        zod: PopoloSpeechSchema },

];

const out = (p: string) => path.join(process.cwd(), p);
const ensureDir = (d: string) => fs.mkdirSync(d, { recursive: true });

function writeJsonSchema(item: SchemaItem) {
  if (!item?.zod || !item?.zod._def) {
    throw new Error(`Schema "${item?.name}" is undefined or not a Zod schema.`);
  }
  const json = zodToJsonSchema(item.zod, item.name, {
    target: "openApi3",
    $refStrategy: "none",
  });
  ensureDir(out("schemas"));
  fs.writeFileSync(out(`schemas/${item.fileBase}.json`), JSON.stringify(json, null, 2));
  console.log(`✓ JSON  ${item.fileBase}.json`);
  return json;
}

function writeMarkdown(item: SchemaItem, jsonSchema: any) {
  // Prefer JSON Schema's properties to avoid Zod internals
  const props = jsonSchema?.properties ?? {};
  const required: string[] = Array.isArray(jsonSchema?.required) ? jsonSchema.required : [];

  const rows: string[] = ["| Field | Type | Required | Description |", "|---|---:|:---:|---|"];
  for (const [key, def] of Object.entries<any>(props)) {
    const type =
      Array.isArray(def.type) ? def.type.join(" | ")
      : def.type ?? (def.anyOf ? def.anyOf.map((x:any)=>x.type).filter(Boolean).join(" | ") : "object");
    const req = required.includes(key) ? "✓" : "";
    const desc = def.description ?? "";
    rows.push(`|\`${key}\`|${type}|${req}|${desc}|`);
  }

  const md = `# Schema: ${item.name}

${rows.join("\n")}
`;
  fs.writeFileSync(out(`schemas/${item.fileBase}.md`), md);
  console.log(`✓ MD    ${item.fileBase}.md`);
}

for (const s of SCHEMAS) {
  const json = writeJsonSchema(s);
  writeMarkdown(s, json);
}
console.log(`Done. Generated ${SCHEMAS.length} schema(s).`);
