import { z } from "zod";

const RateSchema = z.number().min(0).max(1);

const DtRebelityOrganizationSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  classification: z.string().optional(),
  since: z.string().date().optional().nullable(),
  until: z.string().date().optional().nullable(),
});

export const DtAnalysesRebelityRowSchema = z.object({
  person_id: z.string(),
  name: z.string().optional(),
  given_names: z.array(z.string()).optional(),
  family_names: z.array(z.string()).optional(),
  organizations: z.array(DtRebelityOrganizationSchema).optional(),

  rebelity_total: z.number().int().nonnegative().describe(
    "Number of vote events where the member actively voted against their group's majority direction."
  ),
  rebelity_possible: z.number().int().nonnegative().describe(
    "Number of vote events where the member's group had a clear majority direction (non-zero), " +
    "regardless of whether the member was present."
  ),
  rebelity: RateSchema.nullable().describe(
    "rebelity_total / rebelity_possible. Null if rebelity_possible is 0."
  ),

  since: z.string().date().optional().nullable(),
  until: z.string().date().optional().nullable(),
  extras: z.record(z.any()).optional(),
});

export const DtAnalysesRebelitySchema = z.array(DtAnalysesRebelityRowSchema);

export type DtAnalysesRebelityRow = z.infer<typeof DtAnalysesRebelityRowSchema>;
export type DtAnalysesRebelity = z.infer<typeof DtAnalysesRebelitySchema>;
