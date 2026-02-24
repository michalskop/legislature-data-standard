import { z } from "zod";

const WpcaOrganizationSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  classification: z.string().optional(),
  since: z.string().date().optional().nullable().describe("ISO 8601 date (YYYY-MM-DD). Start of membership."),
  until: z.string().date().optional().nullable().describe("ISO 8601 date (YYYY-MM-DD). End of membership. Null/omitted if current."),
});

export const DtAnalysesWpcaRowSchema = z.object({
  person_id: z.string()
    .describe("Identifier of the person (voter_id from votes-table.dt)."),
  name: z.string().optional().nullable(),
  given_names: z.array(z.string()).optional(),
  family_names: z.array(z.string()).optional(),
  organizations: z.array(WpcaOrganizationSchema).optional()
    .describe("Optional organizations relevant for this person (e.g., parliamentary group/party)."),

  dims: z.array(z.number().nullable())
    .describe(
      "Weighted PCA coordinates, one element per dimension (n_dims from definition, default 3). " +
      "Index 0 = first dimension. Null per element if the person was excluded (included=false)."
    ),
  weight: z.number().min(0).max(1)
    .describe(
      "Weighted attendance share used to determine inclusion. " +
      "0 = never voted in any weighted vote event, 1 = voted in all."
    ),
  included: z.boolean()
    .describe("Whether this person met the lo_limit threshold and is included in the global result."),

  since: z.string().date().optional().nullable().describe("ISO 8601 date (YYYY-MM-DD). Null/omitted if unknown or not bounded."),
  until: z.string().date().optional().nullable().describe("ISO 8601 date (YYYY-MM-DD). Null/omitted if unknown or not bounded."),

  extras: z.record(z.any()).optional()
    .describe("Additional metadata fields passed through from the persons input."),
});

export const DtAnalysesWpcaSchema = z.array(DtAnalysesWpcaRowSchema);

export type DtAnalysesWpcaRow = z.infer<typeof DtAnalysesWpcaRowSchema>;
export type DtAnalysesWpca = z.infer<typeof DtAnalysesWpcaSchema>;
