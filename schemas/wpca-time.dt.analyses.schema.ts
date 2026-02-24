import { z } from "zod";

export const DtAnalysesWpcaTimeRowSchema = z.object({
  person_id: z.string()
    .describe("Identifier of the person (voter_id from votes-table.dt)."),

  period_index: z.number().int().min(0)
    .describe("Zero-based index of the time period within the full series."),
  period_start: z.string().date()
    .describe("ISO 8601 date (YYYY-MM-DD). Inclusive start of the time period."),
  period_end: z.string().date()
    .describe("ISO 8601 date (YYYY-MM-DD). Inclusive end of the time period."),
  period_label: z.string().optional()
    .describe("Human-readable label for the time period (e.g. '1. pol. 2021', 'Q1 2021')."),

  dims: z.array(z.number().nullable())
    .describe(
      "Weighted projection of the person into the global PCA eigenbasis for this period. " +
      "One element per dimension (same n_dims as global output). Null per element if person was excluded."
    ),
  included: z.boolean()
    .describe("Whether this person met the lo_limit_time threshold for this period."),
});

export const DtAnalysesWpcaTimeSchema = z.array(DtAnalysesWpcaTimeRowSchema);

export type DtAnalysesWpcaTimeRow = z.infer<typeof DtAnalysesWpcaTimeRowSchema>;
export type DtAnalysesWpcaTime = z.infer<typeof DtAnalysesWpcaTimeSchema>;
