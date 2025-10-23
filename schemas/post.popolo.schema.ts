import { z } from "zod";

const Link = z.object({ url: z.string().url(), note: z.string().optional() });
const Source = z.object({ url: z.string().url(), note: z.string().optional() });
const ContactDetail = z.object({
  type: z.string(), value: z.string(),
  label: z.string().optional(), note: z.string().optional()
});

export const PopoloPostSchema = z.object({
  id: z.string().optional(),
  label: z.string().describe("Label describing the post."),
  other_label: z.union([z.string(), z.array(z.string())]).optional()
               .describe("Alternate label(s), e.g., abbreviations."),
  role: z.string().optional().describe("Function the holder fulfills."),
  organization_id: z.string().describe("Organization in which the post is held."),
  area_id: z.string().optional().describe("Related geographic area ID."),
  start_date: z.string().optional().describe("YYYY-MM-DD (creation/start)."),
  end_date: z.string().optional().describe("YYYY-MM-DD (elimination/end)."),
  contact_details: z.array(ContactDetail).optional(),
  links: z.array(Link).optional(),
  sources: z.array(Source).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

export type PopoloPost = z.infer<typeof PopoloPostSchema>;
