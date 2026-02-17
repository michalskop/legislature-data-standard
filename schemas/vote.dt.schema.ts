import { z } from "zod";
import { PopoloVoteSchema } from "./vote.popolo.schema";

export const DtVoteSchema = PopoloVoteSchema.extend({
  vote_event_id: z.string().describe("ID of the vote-event this vote belongs to."),
  voter_id: z.string().describe("ID of the voter (person or organization)."),
  voter_type: z.enum(["person", "organization"]).optional().describe("Disambiguates whether voter_id refers to a person or an organization."),
  option: z.string().describe(
    "Vote option. Recommended: yes, no, abstain, not voting, absent, secret, unknown. Other values allowed."
  ),
});

export type DtVote = z.infer<typeof DtVoteSchema>;
