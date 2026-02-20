import { z } from "zod";

const RateSchema = z.number().min(0).max(1);

const DtRebelityGovityOrganizationSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  classification: z.string().optional(),
});

export const DtAnalysesRebelityGovityTableRowSchema = z.object({
  person_id: z.string(),
  name: z.string().optional(),
  given_names: z.array(z.string()).optional().describe("JSON array in CSV cell; list<string> in Parquet."),
  family_names: z.array(z.string()).optional().describe("JSON array in CSV cell; list<string> in Parquet."),
  organizations: z.array(DtRebelityGovityOrganizationSchema).optional().describe(
    "JSON array in CSV cell; list<object> in Parquet."
  ),

  rebelity_total: z.number().int().nonnegative(),
  rebelity_possible: z.number().int().nonnegative(),
  rebelity: RateSchema.nullable(),

  govity_total: z.number().int().nonnegative().optional(),
  govity_possible: z.number().int().nonnegative().optional(),
  govity: RateSchema.nullable().optional(),

  since: z.string().date().optional().nullable(),
  until: z.string().date().optional().nullable(),
  extras: z.record(z.any()).optional(),
}).describe("Tabular storage contract for rebelity-govity results (CSV/Parquet). One row per person.");

export type DtAnalysesRebelityGovityTableRow = z.infer<typeof DtAnalysesRebelityGovityTableRowSchema>;
