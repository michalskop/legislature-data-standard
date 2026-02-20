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
import { DtPersonSchema } from "../schemas/person.dt.schema";
import { DtPersonsSchema } from "../schemas/persons.dt.schema";
import { DtTermSchema } from "../schemas/term.dt.schema";
import { DtTermsSchema } from "../schemas/terms.dt.schema";
import { DtOrganizationSchema } from "../schemas/organization.dt.schema";
import { DtOrganizationsSchema } from "../schemas/organizations.dt.schema";
import { DtMembershipSchema } from "../schemas/membership.dt.schema";
import { DtMembershipsSchema } from "../schemas/memberships.dt.schema";
import { DtMotionSchema } from "../schemas/motion.dt.schema";
import { DtMotionsSchema } from "../schemas/motions.dt.schema";
import { DtVoteEventSchema } from "../schemas/vote-event.dt.schema";
import { DtVoteEventsSchema } from "../schemas/vote-events.dt.schema";
import { DtCountSchema } from "../schemas/count.dt.schema";
import { DtVoteSchema } from "../schemas/vote.dt.schema";
import { DtVotesTableRowSchema } from "../schemas/votes-table.dt.schema";
import { DtAnalysesCurrentMembersSchema } from "../schemas/current-members.dt.analyses.schema";
import { DtAnalysesCurrentTermSchema } from "../schemas/current-term.dt.analyses.schema";
import { DtAnalysesAllMembersSchema } from "../schemas/all-members.dt.analyses.schema";
import { DtAnalysesCurrentGroupsSchema } from "../schemas/current-groups.dt.analyses.schema";
import { DtAnalysesAllGroupsSchema } from "../schemas/all-groups.dt.analyses.schema";
import { DtPersonsTableRowSchema } from "../schemas/persons-table.dt.schema";
import { DtAnalysesCurrentMembersTableRowSchema } from "../schemas/current-members-table.dt.analyses.schema";
import { DtAnalysesAllMembersTableRowSchema } from "../schemas/all-members-table.dt.analyses.schema";
import { DtAnalysesCurrentGroupsTableRowSchema } from "../schemas/current-groups-table.dt.analyses.schema";
import { DtAnalysesAllGroupsTableRowSchema } from "../schemas/all-groups-table.dt.analyses.schema";
import { DtAnalysesAttendanceDefinitionSchema } from "../schemas/attendance-definition.dt.analyses.schema";
import { DtAnalysesAttendanceDefinitionTableRowSchema } from "../schemas/attendance-definition-table.dt.analyses.schema";
import { DtAnalysesAttendanceSchema } from "../schemas/attendance.dt.analyses.schema";
import { DtAnalysesAttendanceTableRowSchema } from "../schemas/attendance-table.dt.analyses.schema";
import { DtVoteEventObjectionSchema } from "../schemas/vote-event-objection.dt.schema";
import { DtVoteEventObjectionsSchema } from "../schemas/vote-event-objections.dt.schema";
import { DtAnalysesRebelityDefinitionSchema } from "../schemas/rebelity-definition.dt.analyses.schema";
import { DtAnalysesRebelitySchema } from "../schemas/rebelity.dt.analyses.schema";
import { DtAnalysesRebelityTableRowSchema } from "../schemas/rebelity-table.dt.analyses.schema";
import { DtAnalysesGovityDefinitionSchema } from "../schemas/govity-definition.dt.analyses.schema";
import { DtAnalysesGovitySchema } from "../schemas/govity.dt.analyses.schema";
import { DtAnalysesGovityTableRowSchema } from "../schemas/govity-table.dt.analyses.schema";


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
  { name: "DtPerson",            fileBase: "person.dt",            zod: DtPersonSchema },
  { name: "DtPersons",           fileBase: "persons.dt",           zod: DtPersonsSchema },
  { name: "DtTerm",              fileBase: "term.dt",              zod: DtTermSchema },
  { name: "DtTerms",             fileBase: "terms.dt",             zod: DtTermsSchema },
  { name: "DtOrganization",      fileBase: "organization.dt",      zod: DtOrganizationSchema },
  { name: "DtOrganizations",     fileBase: "organizations.dt",     zod: DtOrganizationsSchema },
  { name: "DtMembership",        fileBase: "membership.dt",        zod: DtMembershipSchema },
  { name: "DtMemberships",       fileBase: "memberships.dt",       zod: DtMembershipsSchema },
  { name: "DtMotion",            fileBase: "motion.dt",            zod: DtMotionSchema },
  { name: "DtMotions",           fileBase: "motions.dt",           zod: DtMotionsSchema },
  { name: "DtVoteEvent",         fileBase: "vote-event.dt",        zod: DtVoteEventSchema },
  { name: "DtVoteEvents",        fileBase: "vote-events.dt",       zod: DtVoteEventsSchema },
  { name: "DtCount",             fileBase: "count.dt",             zod: DtCountSchema },
  { name: "DtVote",              fileBase: "vote.dt",              zod: DtVoteSchema },
  { name: "DtTableVotesRow",     fileBase: "votes-table.dt",       zod: DtVotesTableRowSchema },
  { name: "DtTablePersonsRow",   fileBase: "persons-table.dt",     zod: DtPersonsTableRowSchema },
  { name: "DtAnalysesCurrentMembers", fileBase: "current-members.dt.analyses", zod: DtAnalysesCurrentMembersSchema },
  { name: "DtAnalysesTableCurrentMembersRow", fileBase: "current-members-table.dt.analyses", zod: DtAnalysesCurrentMembersTableRowSchema },
  { name: "DtAnalysesCurrentTerm", fileBase: "current-term.dt.analyses", zod: DtAnalysesCurrentTermSchema },
  { name: "DtAnalysesAllMembers", fileBase: "all-members.dt.analyses", zod: DtAnalysesAllMembersSchema },
  { name: "DtAnalysesTableAllMembersRow", fileBase: "all-members-table.dt.analyses", zod: DtAnalysesAllMembersTableRowSchema },
  { name: "DtAnalysesCurrentGroups", fileBase: "current-groups.dt.analyses", zod: DtAnalysesCurrentGroupsSchema },
  { name: "DtAnalysesTableCurrentGroupsRow", fileBase: "current-groups-table.dt.analyses", zod: DtAnalysesCurrentGroupsTableRowSchema },
  { name: "DtAnalysesAllGroups", fileBase: "all-groups.dt.analyses", zod: DtAnalysesAllGroupsSchema },
  { name: "DtAnalysesTableAllGroupsRow", fileBase: "all-groups-table.dt.analyses", zod: DtAnalysesAllGroupsTableRowSchema },
  { name: "DtAnalysesAttendanceDefinition", fileBase: "attendance-definition.dt.analyses", zod: DtAnalysesAttendanceDefinitionSchema },
  { name: "DtAnalysesTableAttendanceDefinitionRow", fileBase: "attendance-definition-table.dt.analyses", zod: DtAnalysesAttendanceDefinitionTableRowSchema },
  { name: "DtAnalysesAttendance", fileBase: "attendance.dt.analyses", zod: DtAnalysesAttendanceSchema },
  { name: "DtAnalysesTableAttendanceRow", fileBase: "attendance-table.dt.analyses", zod: DtAnalysesAttendanceTableRowSchema },
  { name: "DtVoteEventObjection",  fileBase: "vote-event-objection.dt",  zod: DtVoteEventObjectionSchema },
  { name: "DtVoteEventObjections", fileBase: "vote-event-objections.dt", zod: DtVoteEventObjectionsSchema },
  { name: "DtAnalysesRebelityDefinition",      fileBase: "rebelity-definition.dt.analyses",  zod: DtAnalysesRebelityDefinitionSchema },
  { name: "DtAnalysesRebelity",               fileBase: "rebelity.dt.analyses",             zod: DtAnalysesRebelitySchema },
  { name: "DtAnalysesTableRebelityRow",       fileBase: "rebelity-table.dt.analyses",       zod: DtAnalysesRebelityTableRowSchema },
  { name: "DtAnalysesGovityDefinition",       fileBase: "govity-definition.dt.analyses",    zod: DtAnalysesGovityDefinitionSchema },
  { name: "DtAnalysesGovity",                 fileBase: "govity.dt.analyses",               zod: DtAnalysesGovitySchema },
  { name: "DtAnalysesTableGovityRow",         fileBase: "govity-table.dt.analyses",         zod: DtAnalysesGovityTableRowSchema },
];

const out = (p: string) => path.join(process.cwd(), p);
const ensureDir = (d: string) => fs.mkdirSync(d, { recursive: true });

 function schemaSubdir(fileBase: string) {
   if (fileBase.endsWith(".popolo")) return "popolo";
   if (fileBase.includes(".dt.")) return "dt.analyses";
   if (fileBase.endsWith(".dt")) return "dt";
   return "";
 }

 function schemaOutPath(fileBase: string, ext: string) {
   const sub = schemaSubdir(fileBase);
   return sub ? out(`schemas/${sub}/${fileBase}.${ext}`) : out(`schemas/${fileBase}.${ext}`);
 }

function writeJsonSchema(item: SchemaItem) {
  if (!item?.zod || !item?.zod._def) {
    throw new Error(`Schema "${item?.name}" is undefined or not a Zod schema.`);
  }
  const json = zodToJsonSchema(item.zod, { name: item.name });
  const p = schemaOutPath(item.fileBase, "json");
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, JSON.stringify(json, null, 2));
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
  const p = schemaOutPath(item.fileBase, "md");
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, md);
  console.log(`✓ MD    ${item.fileBase}.md`);
}

for (const s of SCHEMAS) {
  const json = writeJsonSchema(s);
  writeMarkdown(s, json);
}
console.log(`Done. Generated ${SCHEMAS.length} schema(s).`);
