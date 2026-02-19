import { z } from "zod";

/**
 * DT VoteEventObjection: records an objection or correction related to a vote event.
 *
 * Covers two distinct real-world situations (distinguished by `type`):
 *
 *  - "event_objection": a challenge to the entire vote event raised on procedural
 *    or technical grounds — not tied to a specific MP's stated voting intent.
 *    Examples: a group challenges the procedure, a technical fault voids the event.
 *
 *  - "vote_correction": an individual MP states they intended to vote differently
 *    from what was recorded. This may stay as a stenographic note only (outcome=
 *    "announced") OR escalate to full invalidation and a repeat vote (outcome=
 *    "invalidated") if the body approves the repeat. In the Czech parliament,
 *    "zmatecné hlasování" (void vote) is always a vote_correction with outcome=
 *    "invalidated": the MP raised the correction, the body voted to repeat
 *    (decision_vote_event_id), and the original was declared invalid and repeated
 *    (repeated_vote_event_id).
 *
 * The `outcome` field captures what actually happened as a result.
 */
export const DtVoteEventObjectionSchema = z.object({
  id: z.string().describe("Unique ID of this objection/correction record."),

  vote_event_id: z.string().describe("ID of the vote event this objection refers to."),

  type: z.enum(["event_objection", "vote_correction"]).describe(
    "Type of objection. " +
    "'event_objection': challenge to the entire vote event on procedural or technical grounds (not tied to a specific MP's stated voting intent). " +
    "'vote_correction': an individual MP states they intended to vote differently; may remain a stenographic note (outcome=announced) or escalate to invalidation and a repeat vote (outcome=invalidated)."
  ),

  raised_by_id: z.string().optional().describe(
    "ID of the person or organization raising this objection/correction."
  ),

  raised_by_type: z.enum(["person", "organization"]).optional().describe(
    "Disambiguates whether raised_by_id refers to a person or an organization."
  ),

  outcome: z.enum(["invalidated", "announced", "rejected"]).optional().describe(
    "Result of the objection. " +
    "'invalidated': the vote event was declared invalid (and may be repeated; set status='invalid' on the vote-event). " +
    "'announced': objection/correction recorded for the minutes but the vote event result stands. " +
    "'rejected': the objection was formally considered and rejected."
  ),

  decision_vote_event_id: z.string().optional().describe(
    "ID of the vote event that decided the outcome of this objection " +
    "(i.e. the procedural vote on whether to repeat the original vote). " +
    "Applicable when outcome is 'invalidated' or 'rejected' and a separate procedural vote was held."
  ),

  repeated_vote_event_id: z.string().optional().describe(
    "ID of the new vote event that replaced the invalidated one. " +
    "Only set when outcome is 'invalidated' and the vote was actually repeated."
  ),

  intended_option: z.string().optional().describe(
    "For vote_correction: the vote option the MP states they intended to cast " +
    "(e.g. 'yes', 'no'). Uses the same option vocabulary as votes.option."
  ),

  date: z.string().optional().describe(
    "Date the objection was raised. YYYY-MM-DD or ISO datetime."
  ),

  note: z.string().optional().describe(
    "Free-text description, verbatim quote, or transcript reference for the objection."
  ),

  sources: z.array(z.object({
    url: z.string().url(),
    note: z.string().optional(),
  })).optional().describe("Source URLs (e.g. parliamentary minutes page)."),

  extras: z.record(z.any()).optional().describe(
    "Additional metadata fields not covered by the core schema."
  ),
});

export type DtVoteEventObjection = z.infer<typeof DtVoteEventObjectionSchema>;
