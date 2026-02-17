import { z } from "zod";
import { DtVoteEventSchema } from "./vote-event.dt.schema";

export const DtVoteEventsSchema = z.array(DtVoteEventSchema).refine((events) => {
  const ids = events.map(e => e.id).filter(Boolean);
  return new Set(ids).size === ids.length;
}, {
  message: "Vote-event IDs must be unique within the list.",
});

export type DtVoteEvents = z.infer<typeof DtVoteEventsSchema>;
