import { z } from "zod";
import { PopoloVoteEventSchema } from "./vote-event.popolo.schema";
import { DtCountSchema } from "./count.dt.schema";
import { DtVoteSchema } from "./vote.dt.schema";

/**
 * DT VoteEvent: Popolo-compatible vote-event.
 *
 * Adds normalized result/status and typed counts/votes.
 */
export const DtVoteEventSchema = PopoloVoteEventSchema.extend({
  id: z.string().describe("Vote-event ID."),

  counts: z.array(DtCountSchema).optional().describe("Aggregate counts per option."),
  votes: z.array(DtVoteSchema).optional().describe("Individual votes."),

  result: z.enum(["pass", "fail"]).optional().nullable().describe("Outcome of the vote-event. Null/omitted if unknown."),

  status: z.enum(["valid", "invalid", "test", "other"]).optional().default("valid").describe(
    "Vote-event status. Default is valid. Use invalid for annulled/mistaken votes, test for test votes, other for special cases."
  ),

  requirement: z.string().optional().describe("Voting requirement for this vote-event (e.g., simple majority, 3/5)."),
  extras: z.record(z.any()).optional().describe("Additional metadata fields not covered by the core schema (e.g., sitting number, agenda item)."),
});

export type DtVoteEvent = z.infer<typeof DtVoteEventSchema>;
