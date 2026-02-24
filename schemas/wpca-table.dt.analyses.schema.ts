import { z } from "zod";

const WpcaOrganizationSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  classification: z.string().optional(),
  since: z.string().date().optional().nullable(),
  until: z.string().date().optional().nullable(),
});

export const DtAnalysesWpcaTableRowSchema = z.object({
  person_id: z.string()
    .describe("Identifier of the person (voter_id from votes-table.dt)."),
  name: z.string().optional().nullable(),
  given_names: z.array(z.string()).optional()
    .describe("JSON array in CSV cell; list<string> in Parquet."),
  family_names: z.array(z.string()).optional()
    .describe("JSON array in CSV cell; list<string> in Parquet."),
  organizations: z.array(WpcaOrganizationSchema).optional()
    .describe("JSON array in CSV cell; list<object> in Parquet."),

  dim1: z.number().nullable().optional().describe("Score on the first PCA dimension. Null if person was excluded."),
  dim2: z.number().nullable().optional().describe("Score on the second PCA dimension. Null if person was excluded."),
  dim3: z.number().nullable().optional().describe("Score on the third PCA dimension. Null if person was excluded."),

  weight: z.number().min(0).max(1),
  included: z.boolean(),

  since: z.string().date().optional().nullable(),
  until: z.string().date().optional().nullable(),
  extras: z.record(z.any()).optional(),
}).describe("Tabular storage contract for WPCA global results (CSV/Parquet). One row per person.");

export type DtAnalysesWpcaTableRow = z.infer<typeof DtAnalysesWpcaTableRowSchema>;
