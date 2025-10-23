import { z } from "zod";
/** Popolo Contact Detail */
export const PopoloContactDetailSchema = z.object({
  type: z.string().describe("e.g., email, phone, address, fax, web"),
  value: z.string().describe("The contact value, e.g., address text, email address"),
  label: z.string().optional().describe("e.g., Constituency office"),
  note: z.string().optional(),
  valid_from: z.string().optional().describe("YYYY-MM-DD"),
  valid_until: z.string().optional().describe("YYYY-MM-DD")
});
export type PopoloContactDetail = z.infer<typeof PopoloContactDetailSchema>;
