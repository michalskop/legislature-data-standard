import { z } from "zod";

const DtIdentifierSchema = z.object({
  scheme: z.string(),
  identifier: z.string(),
});

/** DT Term: a parliamentary (or similar) term */
export const DtTermSchema = z.object({
  id: z.string(),
  name: z.string(),
  since: z.string().date().describe("ISO 8601 date (YYYY-MM-DD)."),
  until: z.string().date().optional().nullable().describe("ISO 8601 date (YYYY-MM-DD). Null/omitted if ongoing or unknown."),
  until_latest: z.string().date().optional().nullable().describe("ISO 8601 date (YYYY-MM-DD). Latest possible end date."),
  identifiers: z.array(DtIdentifierSchema).optional(),
  note: z.string().optional(),
}).refine((v) => {
  if (!v.until_latest || !v.until) return true;
  return v.until_latest >= v.until;
}, {
  message: "until_latest must be >= until",
  path: ["until_latest"],
});

export type DtTerm = z.infer<typeof DtTermSchema>;
