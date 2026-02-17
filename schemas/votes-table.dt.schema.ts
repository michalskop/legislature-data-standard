import { z } from "zod";

export const DtVotesTableRowSchema = z.object({
  vote_event_id: z.string().describe("ID of the vote-event this vote belongs to."),
  voter_id: z.string().describe("ID of the voter (person or organization)."),
  voter_type: z.enum(["person", "organization"]).optional().describe("Disambiguates whether voter_id refers to a person or an organization."),
  option: z.string().describe("Vote option. Recommended: yes, no, abstain, not voting, absent, secret, unknown. Other values allowed."),
  role: z.string().optional(),
  note: z.string().optional(),
}).describe("Tabular storage contract for votes (CSV/Parquet). One row per vote.");

export type DtVotesTableRow = z.infer<typeof DtVotesTableRowSchema>;
