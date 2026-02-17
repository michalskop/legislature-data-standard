import { z } from "zod";
import { DtPersonSchema } from "./person.dt.schema";

/** DT analysis: All members (a list of persons, including former members within the term) */
export const DtAnalysesAllMembersSchema = z.array(DtPersonSchema).refine((persons) => {
  const ids = persons.map(p => p.id);
  return new Set(ids).size === ids.length;
}, {
  message: "Person IDs must be unique within the list.",
});

export type DtAnalysesAllMembers = z.infer<typeof DtAnalysesAllMembersSchema>;
