import { z } from "zod";

const RateSchema = z.number().min(0).max(1);

const DtRebelityGovityOrganizationSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  classification: z.string().optional(),
  since: z.string().date().optional().nullable().describe(
    "ISO 8601 date (YYYY-MM-DD). Start of membership in this organization."
  ),
  until: z.string().date().optional().nullable().describe(
    "ISO 8601 date (YYYY-MM-DD). End of membership. Null/omitted if current."
  ),
});

export const DtAnalysesRebelityGovityRowSchema = z.object({
  person_id: z.string(),
  name: z.string().optional(),
  given_names: z.array(z.string()).optional(),
  family_names: z.array(z.string()).optional(),
  organizations: z.array(DtRebelityGovityOrganizationSchema).optional().describe(
    "Organizations relevant to this person (group, candidate list, constituency)."
  ),

  // ── Rebelity ───────────────────────────────────────────────────────────────
  rebelity_total: z.number().int().nonnegative().describe(
    "Number of vote events where the member actively voted against their group's majority direction."
  ),
  rebelity_possible: z.number().int().nonnegative().describe(
    "Number of vote events where the member's group had a clear majority direction (non-zero). " +
    "This is the denominator for rebelity, regardless of whether the member was present."
  ),
  rebelity: RateSchema.nullable().describe(
    "rebelity_total / rebelity_possible. Null if rebelity_possible is 0 (undefined)."
  ),

  // ── Govity (optional — only present when a government is defined) ───────────
  govity_total: z.number().int().nonnegative().optional().describe(
    "Number of vote events where the government had a clear direction, the member was present, " +
    "and the member did NOT actively vote against the government."
  ),
  govity_possible: z.number().int().nonnegative().optional().describe(
    "Number of vote events where the government had a clear direction AND the member was present. " +
    "This is the denominator for govity."
  ),
  govity: RateSchema.nullable().optional().describe(
    "govity_total / govity_possible. Null if govity_possible is 0 (undefined). " +
    "Omitted if no government definition was provided."
  ),

  since: z.string().date().optional().nullable().describe(
    "ISO 8601 date. Lower bound of the analysis period (from definition). Null/omitted if no lower bound."
  ),
  until: z.string().date().optional().nullable().describe(
    "ISO 8601 date. Upper bound of the analysis period (from definition). Null/omitted if no upper bound."
  ),

  extras: z.record(z.any()).optional().describe(
    "Additional metadata fields not covered by the core schema."
  ),
});

export const DtAnalysesRebelityGovitySchema = z.array(DtAnalysesRebelityGovityRowSchema);

export type DtAnalysesRebelityGovityRow = z.infer<typeof DtAnalysesRebelityGovityRowSchema>;
export type DtAnalysesRebelityGovity = z.infer<typeof DtAnalysesRebelityGovitySchema>;
