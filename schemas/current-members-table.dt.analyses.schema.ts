import { z } from "zod";

/** DT analysis current members table row (tabular storage contract) */
export const DtAnalysesCurrentMembersTableRowSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  given_names: z.array(z.string()).optional().describe("JSON array in CSV cell; list<string> in Parquet."),
  family_names: z.array(z.string()).optional().describe("JSON array in CSV cell; list<string> in Parquet."),
});

export type DtAnalysesCurrentMembersTableRow = z.infer<typeof DtAnalysesCurrentMembersTableRowSchema>;
