import { z } from "zod";

const RateSchema = z.number().min(0).max(1);

export const DtAnalysesGovityTableRowSchema = z.object({
  person_id: z.string(),
  name: z.string().optional(),
  given_names: z.array(z.string()).optional().describe("JSON array in CSV cell; list<string> in Parquet."),
  family_names: z.array(z.string()).optional().describe("JSON array in CSV cell; list<string> in Parquet."),
  organizations: z.array(z.object({ id: z.string(), name: z.string().optional(), classification: z.string().optional() })).optional().describe("JSON array in CSV cell."),
  govity_total: z.number().int().nonnegative(),
  govity_possible: z.number().int().nonnegative(),
  govity: RateSchema.nullable(),
  since: z.string().date().optional().nullable(),
  until: z.string().date().optional().nullable(),
  extras: z.record(z.any()).optional(),
}).describe("Tabular storage contract for govity results (CSV/Parquet). One row per person.");

export type DtAnalysesGovityTableRow = z.infer<typeof DtAnalysesGovityTableRowSchema>;
