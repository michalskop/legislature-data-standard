import { z } from "zod";
import { DtPersonSchema } from "./person.dt.schema";

/** DT analysis: Current members (a list of persons) */
export const DtAnalysesCurrentMembersSchema = z.array(DtPersonSchema).refine((persons) => {
  const ids = persons.map(p => p.id);
  return new Set(ids).size === ids.length;
}, {
  message: "Person IDs must be unique within the list.",
});

export type DtAnalysesCurrentMembers = z.infer<typeof DtAnalysesCurrentMembersSchema>;
