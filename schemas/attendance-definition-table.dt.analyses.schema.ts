import { z } from "zod";

export const DtAnalysesAttendanceDefinitionTableRowSchema = z.object({
  since: z.string().date().optional().nullable().describe("ISO 8601 date (YYYY-MM-DD). Null/omitted if unknown or not bounded."),
  until: z.string().date().optional().nullable().describe("ISO 8601 date (YYYY-MM-DD). Null/omitted if unknown or not bounded."),
  present_options: z.array(z.string()).describe("JSON array in CSV cell; list<string> in Parquet."),
  absent_options: z.array(z.string()).describe("JSON array in CSV cell; list<string> in Parquet."),
  extras: z.record(z.any()).optional(),
}).describe("Tabular storage contract for attendance definition (CSV/Parquet). Typically a small table (often 1 row).");

export type DtAnalysesAttendanceDefinitionTableRow = z.infer<typeof DtAnalysesAttendanceDefinitionTableRowSchema>;
