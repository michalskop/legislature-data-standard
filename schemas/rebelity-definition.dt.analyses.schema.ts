import { z } from "zod";

/**
 * Definition file for the rebelity analysis.
 *
 * rebelity: how often a member votes actively against their own group's majority.
 *
 * Vote semantics:
 *   - yes_options → vote_value = +1, active = +1
 *   - no_options  → vote_value = -1, active = -1
 *   - present but not in yes_options/no_options (e.g. abstain) → vote_value = -1
 *     for group direction (counts against), active = 0
 *   - absent_options → vote_value = 0, not present
 *
 * Group direction per vote event = sign(sum of vote_values for all group members).
 * Rebelity denominator = vote events where group had a clear direction (≠ 0),
 *   regardless of whether the MP was present.
 */
export const DtAnalysesRebelityDefinitionSchema = z.object({
  since: z.string().date().optional().nullable().describe(
    "ISO 8601 date (YYYY-MM-DD). Only vote events on or after this date are included. Null/omitted = no lower bound."
  ),
  until: z.string().date().optional().nullable().describe(
    "ISO 8601 date (YYYY-MM-DD). Only vote events on or before this date are included. Null/omitted = no upper bound."
  ),

  present_options: z.array(z.string()).describe(
    "Vote option values that count as 'present'. E.g. ['yes', 'no', 'abstain']."
  ),
  absent_options: z.array(z.string()).describe(
    "Vote option values that count as 'absent' (zero contribution to direction). E.g. ['absent']."
  ),
  yes_options: z.array(z.string()).describe(
    "Vote option values that mean 'voted yes' (+1 active, +1 to direction). E.g. ['yes']."
  ),
  no_options: z.array(z.string()).describe(
    "Vote option values that mean 'voted no' (-1 active, -1 to direction). E.g. ['no', 'no_with_explanation']."
  ),

  extras: z.record(z.any()).optional().describe(
    "Additional metadata fields not covered by the core schema."
  ),
});

export type DtAnalysesRebelityDefinition = z.infer<typeof DtAnalysesRebelityDefinitionSchema>;
