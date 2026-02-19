import { z } from "zod";

/**
 * Definition file for the rebelity-govity analysis.
 *
 * rebelity: how often a member votes actively against their own group's majority.
 * govity:   how often a member votes with the government (present and not actively against).
 *
 * Vote semantics (fixed):
 *   - yes_option  → vote_value = +1  (actively yes)
 *   - no_option   → vote_value = -1  (actively no)
 *   - present but not yes/no (e.g. abstain) → vote_value = -1 for group/gov direction, active = 0
 *   - absent_options → vote_value = 0, not present
 *
 * Group direction per vote event = sign(sum of vote_values for all group members).
 * Government direction per vote event = sign(sum of vote_values for all government members).
 *
 * Rebelity denominator: vote events where group had a clear direction (≠ 0),
 *   regardless of whether the MP was present.
 * Govity denominator: vote events where government had a clear direction AND the MP was present.
 */
export const DtAnalysesRebelityGovityDefinitionSchema = z.object({
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
  yes_option: z.string().describe(
    "The vote option string that means 'voted yes' (+1 active, +1 to direction). E.g. 'yes'."
  ),
  no_option: z.string().describe(
    "The vote option string that means 'voted no' (-1 active, -1 to direction). E.g. 'no'."
  ),

  government_groups: z.array(z.string()).optional().describe(
    "Organization IDs of groups that form the government. Omit or leave empty to skip govity."
  ),
  government_members: z.array(z.string()).optional().describe(
    "Person IDs of individual government members not covered by government_groups (e.g. independents)."
  ),

  extras: z.record(z.any()).optional().describe(
    "Additional metadata fields not covered by the core schema."
  ),
});

export type DtAnalysesRebelityGovityDefinition = z.infer<typeof DtAnalysesRebelityGovityDefinitionSchema>;
