import { z } from "zod";
/** Popolo Count (aggregate tally for a vote option) */
export const PopoloCountSchema = z.object({
  option: z.string().describe("e.g., yes, no, abstain, absent, not voting"),
  value: z.number().int().nonnegative()
});
export type PopoloCount = z.infer<typeof PopoloCountSchema>;
