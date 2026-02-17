import { z } from "zod";
import { DtOrganizationSchema } from "./organization.dt.schema";

const ShareSchema = z.number().min(0).max(1);

export const DtAnalysesAttendanceRowSchema = z.object({
  person_id: z.string().optional().describe("Person ID (if attendance is computed per person)."),
  organization_id: z.string().optional().describe("Organization ID (if attendance is computed per organization/group)."),
  since: z.string().date().optional().nullable().describe("ISO 8601 date (YYYY-MM-DD). Null/omitted if unknown or not bounded."),
  until: z.string().date().optional().nullable().describe("ISO 8601 date (YYYY-MM-DD). Null/omitted if unknown or not bounded."),
  vote_events_total: z.number().int().nonnegative(),
  present: z.number().int().nonnegative(),
  absent: z.number().int().nonnegative(),
  present_share: ShareSchema.optional().nullable().describe("present / vote_events_total. Null/omitted if undefined (e.g., total is 0)."),
  extras: z.record(z.any()).optional().describe("Additional metadata fields not covered by the core schema."),
}).refine((v) => {
  const hasPerson = typeof v.person_id === "string" && v.person_id.length > 0;
  const hasOrg = typeof v.organization_id === "string" && v.organization_id.length > 0;
  return (hasPerson && !hasOrg) || (!hasPerson && hasOrg);
}, {
  message: "Exactly one of person_id or organization_id must be provided",
  path: ["person_id"],
});

export const DtAnalysesAttendanceSchema = z.array(DtAnalysesAttendanceRowSchema);

export const DtAnalysesAttendanceOutputSchema = z.union([
  DtAnalysesAttendanceSchema,
  z.object({
    rows: DtAnalysesAttendanceSchema,
    organizations: z.array(DtOrganizationSchema).optional().describe("Optional organizations referenced by organization_id in rows."),
  }),
]);

export type DtAnalysesAttendanceRow = z.infer<typeof DtAnalysesAttendanceRowSchema>;
export type DtAnalysesAttendance = z.infer<typeof DtAnalysesAttendanceSchema>;
export type DtAnalysesAttendanceOutput = z.infer<typeof DtAnalysesAttendanceOutputSchema>;
