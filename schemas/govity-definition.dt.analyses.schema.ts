import { z } from "zod";

/**
 * Definition file for the govity analysis.
 *
 * govity: how often a member votes with the government (present and not actively against).
 *
 * Vote semantics:
 *   - yes_options → vote_value = +1, active = +1
 *   - no_options  → vote_value = -1, active = -1
 *   - present but not in yes_options/no_options (e.g. abstain) → vote_value = -1
 *     for government direction (counts against), active = 0
 *   - absent_options → vote_value = 0, not present
 *
 * Government direction per vote event = sign(sum of vote_values for all government members).
 * Govity denominator = vote events where government had a clear direction AND the MP was present.
 */
export const DtAnalysesGovityDefinitionSchema = z.object({
  since: z.string().date().optional().nullable().describe(
    "ISO 8601 date (YYYY-MM-DD). Only vote events on or after this date are included. Null/omitted = no lower bound."
  ),
  until: z.string().date().optional().nullable().describe(
    "ISO 8601 date (YYYY-MM-DD). Only vote events on or before this date are included. Null/omitted = no upper bound."
  ),

  present_options: z.array(z.string()).describe(
    "Vote option values that count as 'present' (used for govity denominator). E.g. ['yes', 'no', 'abstain']."
  ),
  absent_options: z.array(z.string()).describe(
    "Vote option values that count as 'absent' (not present, zero contribution to direction). E.g. ['absent']."
  ),
  yes_options: z.array(z.string()).describe(
    "Vote option values that mean 'voted yes' (+1 active, +1 to direction). E.g. ['yes']."
  ),
  no_options: z.array(z.string()).describe(
    "Vote option values that mean 'voted no' (-1 active, -1 to direction). E.g. ['no', 'no_with_explanation']."
  ),

  government_groups: z.array(z.string()).describe(
    "Organization IDs of groups that form the government."
  ),
  government_members: z.array(z.string()).optional().describe(
    "Person IDs of individual government members not covered by government_groups (e.g. independents)."
  ),

  extras: z.record(z.any()).optional().describe(
    "Additional metadata fields not covered by the core schema."
  ),
});

export type DtAnalysesGovityDefinition = z.infer<typeof DtAnalysesGovityDefinitionSchema>;
