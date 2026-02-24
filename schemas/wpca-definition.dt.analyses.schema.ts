import { z } from "zod";

/**
 * Definition file for the Weighted PCA (WPCA) analysis.
 *
 * WPCA positions each member in a low-dimensional ideological space using
 * a weighted covariance matrix of their voting records.
 *
 * Vote encoding:
 *   yes_options    → +1  (in favour)
 *   no_options     → -1  (against or abstaining)
 *   absent_options → NA  (not counted, excluded from weights)
 *
 * Two vote-event weights are applied before PCA:
 *   w1 = participation rate (fraction of members voting)
 *   w2 = balance (1 = 50/50 split, 0 = unanimous)
 */

const RotationSchema = z.object({
  voter_id: z.union([z.string(), z.number()])
    .describe("The voter_id of the reference person used to orient PCA axes."),
  dims: z.array(z.union([z.literal(1), z.literal(-1)]))
    .describe(
      "Sign (+1 or -1) for each of the first n dimensions. " +
      "If the reference person's coordinate in that dimension has the opposite sign, the whole axis is flipped."
    ),
}).describe(
  "Reference person for orienting PCA dimensions consistently across runs. " +
  "Without rotation the sign of each axis is arbitrary."
);

export const DtAnalysesWpcaDefinitionSchema = z.object({
  lo_limit: z.number().min(0).max(1)
    .describe(
      "Minimum weighted attendance share (0–1) for a person to be included in the global PCA result. " +
      "Persons below this threshold are computed but marked included=false."
    ),

  lo_limit_time: z.number().min(0).max(1).optional()
    .describe(
      "Minimum weighted attendance share for time-interval projections. " +
      "Defaults to lo_limit if omitted."
    ),

  yes_options: z.array(z.string())
    .describe("Vote option values that encode to +1. E.g. ['yes']."),

  no_options: z.array(z.string())
    .describe("Vote option values that encode to -1. E.g. ['no', 'abstain']."),

  absent_options: z.array(z.string())
    .describe("Vote option values that encode to NA (excluded from weight calculations). E.g. ['absent', 'before oath']."),

  rotate: RotationSchema.optional()
    .describe("Reference person for orienting PCA axes so results are comparable across runs."),

  time_interval: z.enum(["half-year", "quarter", "year"]).optional().nullable()
    .describe(
      "Size of time windows for rolling projections using the global eigenbasis. " +
      "Null or omitted means no time-interval output."
    ),

  since: z.string().date().optional().nullable()
    .describe("ISO 8601 date (YYYY-MM-DD). Only vote events on or after this date are included. Null/omitted = no lower bound."),

  until: z.string().date().optional().nullable()
    .describe("ISO 8601 date (YYYY-MM-DD). Only vote events on or before this date are included. Null/omitted = no upper bound."),

  n_dims: z.number().int().min(1).max(20).optional()
    .describe("Number of PCA dimensions to retain in the output. Defaults to 3."),

  extras: z.record(z.any()).optional()
    .describe("Additional metadata fields not covered by the core schema."),
});

export type DtAnalysesWpcaDefinition = z.infer<typeof DtAnalysesWpcaDefinitionSchema>;
