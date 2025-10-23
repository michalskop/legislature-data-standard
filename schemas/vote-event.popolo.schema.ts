import { z } from "zod";
const Link = z.object({ url: z.string().url(), note: z.string().optional() });
const Source = z.object({ url: z.string().url(), note: z.string().optional() });
/** Popolo VoteEvent */
export const PopoloVoteEventSchema = z.object({
  id: z.string().optional(),
  identifier: z.string().optional().describe("Roll call or journal id"),
  motion_id: z.string().optional(),
  organization_id: z.string().optional(),
  start_date: z.string().optional().describe("YYYY-MM-DD or ISO datetime"),
  end_date: z.string().optional().describe("YYYY-MM-DD or ISO datetime"),
  result: z.string().optional().describe("e.g., passed, failed"),
  counts: z.array(z.any()).optional().describe("See Count objects"),
  votes: z.array(z.any()).optional().describe("See Vote objects"),
  sources: z.array(Source).optional(),
  links: z.array(Link).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});
export type PopoloVoteEvent = z.infer<typeof PopoloVoteEventSchema>;
