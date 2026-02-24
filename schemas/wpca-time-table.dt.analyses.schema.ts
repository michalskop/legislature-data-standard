import { z } from "zod";

export const DtAnalysesWpcaTimeTableRowSchema = z.object({
  person_id: z.string()
    .describe("Identifier of the person (voter_id from votes-table.dt)."),

  period_index: z.number().int().min(0),
  period_start: z.string().date().describe("ISO 8601 date (YYYY-MM-DD). Inclusive start of the time period."),
  period_end: z.string().date().describe("ISO 8601 date (YYYY-MM-DD). Inclusive end of the time period."),
  period_label: z.string().optional().nullable(),

  dim1: z.number().nullable().optional().describe("Score on the first PCA dimension for this period."),
  dim2: z.number().nullable().optional().describe("Score on the second PCA dimension for this period."),
  dim3: z.number().nullable().optional().describe("Score on the third PCA dimension for this period."),

  included: z.boolean(),
}).describe("Tabular storage contract for WPCA time-interval projections (CSV/Parquet). One row per person per period.");

export type DtAnalysesWpcaTimeTableRow = z.infer<typeof DtAnalysesWpcaTimeTableRowSchema>;
