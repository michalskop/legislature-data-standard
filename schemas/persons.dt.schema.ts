import { z } from "zod";
import { DtPersonSchema } from "./person.dt.schema";

/** DT Persons: A list of persons */
export const DtPersonsSchema = z.array(DtPersonSchema).refine((persons) => {
  const ids = persons.map(p => p.id);
  return new Set(ids).size === ids.length;
}, {
  message: "Person IDs must be unique within the list.",
});

export type DtPersons = z.infer<typeof DtPersonsSchema>;
