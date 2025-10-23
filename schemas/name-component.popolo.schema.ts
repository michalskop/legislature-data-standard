import { z } from "zod";
/** Popolo Name Component */
export const PopoloNameComponentSchema = z.object({
  family_name: z.string().optional(),
  given_name: z.string().optional(),
  additional_name: z.string().optional(),
  honorific_prefix: z.string().optional(),
  honorific_suffix: z.string().optional(),
  patronymic_name: z.string().optional(),
  sort_name: z.string().optional().describe("Sort-as name (family, given)"),
  note: z.string().optional(),
  start_date: z.string().optional().describe("YYYY-MM-DD"),
  end_date: z.string().optional().describe("YYYY-MM-DD")
});
export type PopoloNameComponent = z.infer<typeof PopoloNameComponentSchema>;
