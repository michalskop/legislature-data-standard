import { z } from "zod";
const Link = z.object({ url: z.string().url(), note: z.string().optional() });
const Source = z.object({ url: z.string().url(), note: z.string().optional() });
/** Popolo Event */
export const PopoloEventSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  start_date: z.string().optional().describe("YYYY-MM-DD or ISO datetime"),
  end_date: z.string().optional().describe("YYYY-MM-DD or ISO datetime"),
  location: z.string().optional(),
  classification: z.string().optional().describe("e.g., session, sitting, hearing"),
  organization_id: z.string().optional(),
  parent_id: z.string().optional(),
  links: z.array(Link).optional(),
  sources: z.array(Source).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});
export type PopoloEvent = z.infer<typeof PopoloEventSchema>;
