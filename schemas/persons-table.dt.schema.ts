import { z } from "zod";

/** DT persons table row (tabular storage contract) */
export const DtPersonsTableRowSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  given_names: z.array(z.string()).optional().describe("JSON array in CSV cell; list<string> in Parquet."),
  family_names: z.array(z.string()).optional().describe("JSON array in CSV cell; list<string> in Parquet."),
}).describe("Tabular storage contract for a persons table (CSV/Parquet). One row per person; not the full nested DtPerson object.");

export type DtPersonsTableRow = z.infer<typeof DtPersonsTableRowSchema>;
