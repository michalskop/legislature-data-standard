import { z } from "zod";

/** DT analysis all members table row (tabular storage contract) */
export const DtAnalysesAllMembersTableRowSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  given_names: z.array(z.string()).optional().describe("JSON array in CSV cell; list<string> in Parquet."),
  family_names: z.array(z.string()).optional().describe("JSON array in CSV cell; list<string> in Parquet."),
}).describe("Tabular storage contract for an all-members table (CSV/Parquet). One row per person.");

export type DtAnalysesAllMembersTableRow = z.infer<typeof DtAnalysesAllMembersTableRowSchema>;
