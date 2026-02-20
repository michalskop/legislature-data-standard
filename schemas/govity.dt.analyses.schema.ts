import { z } from "zod";

const RateSchema = z.number().min(0).max(1);

const DtGovityOrganizationSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  classification: z.string().optional(),
  since: z.string().date().optional().nullable(),
  until: z.string().date().optional().nullable(),
});

export const DtAnalysesGovityRowSchema = z.object({
  person_id: z.string(),
  name: z.string().optional(),
  given_names: z.array(z.string()).optional(),
  family_names: z.array(z.string()).optional(),
  organizations: z.array(DtGovityOrganizationSchema).optional(),

  govity_total: z.number().int().nonnegative().describe(
    "Number of vote events where the government had a clear direction, the member was present, " +
    "and the member did NOT actively vote against the government."
  ),
  govity_possible: z.number().int().nonnegative().describe(
    "Number of vote events where the government had a clear direction AND the member was present."
  ),
  govity: RateSchema.nullable().describe(
    "govity_total / govity_possible. Null if govity_possible is 0."
  ),

  since: z.string().date().optional().nullable(),
  until: z.string().date().optional().nullable(),
  extras: z.record(z.any()).optional(),
});

export const DtAnalysesGovitySchema = z.array(DtAnalysesGovityRowSchema);

export type DtAnalysesGovityRow = z.infer<typeof DtAnalysesGovityRowSchema>;
export type DtAnalysesGovity = z.infer<typeof DtAnalysesGovitySchema>;
