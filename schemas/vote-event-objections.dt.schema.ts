import { z } from "zod";
import { DtVoteEventObjectionSchema } from "./vote-event-objection.dt.schema";

export const DtVoteEventObjectionsSchema = z.array(DtVoteEventObjectionSchema).refine((items) => {
  const ids = items.map(i => i.id).filter(Boolean);
  return new Set(ids).size === ids.length;
}, {
  message: "Vote-event objection IDs must be unique within the list.",
});

export type DtVoteEventObjections = z.infer<typeof DtVoteEventObjectionsSchema>;
