import { z } from "zod";
/** Popolo Vote (individual) */
export const PopoloVoteSchema = z.object({
  id: z.string().optional(),
  voter_id: z.string().optional().describe("Person id (or org id when applicable)"),
  option: z.string().describe("e.g., yes, no, abstain, absent, not voting"),
  role: z.string().optional().describe("e.g., Speaker, Acting"),
  note: z.string().optional()
});
export type PopoloVote = z.infer<typeof PopoloVoteSchema>;
