import { z } from "zod";

export const DtAnalysesCurrentGroupsTableRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  classification: z.string().optional(),
  parent_id: z.string().optional(),
});

export type DtAnalysesCurrentGroupsTableRow = z.infer<typeof DtAnalysesCurrentGroupsTableRowSchema>;
