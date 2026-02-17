import { z } from "zod";

export const DtAnalysesAttendanceDefinitionSchema = z.object({
  since: z.string().date().optional().nullable().describe("ISO 8601 date (YYYY-MM-DD). Null/omitted if unknown or not bounded."),
  until: z.string().date().optional().nullable().describe("ISO 8601 date (YYYY-MM-DD). Null/omitted if unknown or not bounded."),
  present_options: z.array(z.string()).describe("Vote option values that count as present (as found in votes.option)."),
  absent_options: z.array(z.string()).describe("Vote option values that count as absent (as found in votes.option)."),
  extras: z.record(z.any()).optional().describe("Additional metadata fields not covered by the core schema."),
});

export type DtAnalysesAttendanceDefinition = z.infer<typeof DtAnalysesAttendanceDefinitionSchema>;
