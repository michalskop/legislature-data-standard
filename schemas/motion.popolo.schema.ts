import { z } from "zod";
const Link = z.object({ url: z.string().url(), note: z.string().optional() });
const Source = z.object({ url: z.string().url(), note: z.string().optional() });
/** Popolo Motion */
export const PopoloMotionSchema = z.object({
  id: z.string().optional(),
  identifier: z.string().optional().describe("Legislative identifier"),
  organization_id: z.string().optional().describe("Sponsoring or deciding organization"),
  date: z.string().optional().describe("YYYY-MM-DD"),
  text: z.string().optional().describe("Motion text"),
  classification: z.string().optional().describe("e.g., passage, amendment, appointment"),
  result: z.string().optional().describe("e.g., passed, failed"),
  requirement: z.string().optional().describe("e.g., simple majority"),
  links: z.array(Link).optional(),
  sources: z.array(Source).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});
export type PopoloMotion = z.infer<typeof PopoloMotionSchema>;
