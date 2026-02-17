import { z } from "zod";

export const DtAnalysesAllGroupsTableRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  classification: z.string().optional(),
  parent_id: z.string().optional(),
});

export type DtAnalysesAllGroupsTableRow = z.infer<typeof DtAnalysesAllGroupsTableRowSchema>;
