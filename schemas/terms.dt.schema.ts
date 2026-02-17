import { z } from "zod";
import { DtTermSchema } from "./term.dt.schema";

/** DT Terms: A list of terms */
export const DtTermsSchema = z.array(DtTermSchema).refine((terms) => {
  const ids = terms.map(t => t.id);
  return new Set(ids).size === ids.length;
}, {
  message: "Term IDs must be unique within the list.",
});

export type DtTerms = z.infer<typeof DtTermsSchema>;
