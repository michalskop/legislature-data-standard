import { z } from "zod";

const ShareSchema = z.number().min(0).max(1);

const DtAttendanceOrganizationSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  classification: z.string().optional(),
  parent_id: z.string().optional(),
});

export const DtAnalysesAttendanceTableRowSchema = z.object({
  person_id: z.string(),
  name: z.string().optional(),
  given_names: z.array(z.string()).optional().describe("JSON array in CSV cell; list<string> in Parquet."),
  family_names: z.array(z.string()).optional().describe("JSON array in CSV cell; list<string> in Parquet."),
  organizations: z.array(DtAttendanceOrganizationSchema).optional().describe("JSON array in CSV cell; list<object> in Parquet."),
  since: z.string().date().optional().nullable().describe("ISO 8601 date (YYYY-MM-DD). Null/omitted if unknown or not bounded."),
  until: z.string().date().optional().nullable().describe("ISO 8601 date (YYYY-MM-DD). Null/omitted if unknown or not bounded."),
  vote_events_total: z.number().int().nonnegative(),
  present: z.number().int().nonnegative(),
  absent: z.number().int().nonnegative(),
  present_share: ShareSchema.optional().nullable().describe("present / vote_events_total. Null/omitted if undefined (e.g., total is 0)."),
  extras: z.record(z.any()).optional(),
}).describe("Tabular storage contract for attendance results (CSV/Parquet). One row per person.");

export type DtAnalysesAttendanceTableRow = z.infer<typeof DtAnalysesAttendanceTableRowSchema>;
