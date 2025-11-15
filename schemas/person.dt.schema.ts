import { z } from "zod";
import { PopoloPersonSchema } from "./person.popolo.schema";

/** A simplified membership object for denormalization */
const DtMembershipSchema = z.object({
  id: z.string(),
  name: z.string(),
  start_date: z.string().datetime({ message: "Must be a valid ISO 8601 date or date-time" }).optional().nullable(),
  end_date: z.string().datetime({ message: "Must be a valid ISO 8601 date or date-time" }).optional().nullable(),
});

/** Helper: split "A, B , C" -> ["A","B","C"] and trim; pass-through arrays */
const toStringArray = (v: unknown) => {
  if (Array.isArray(v)) return v.map(String).map(s => s.trim()).filter(Boolean);
  if (typeof v === "string") return v.split(",").map(s => s.trim()).filter(Boolean);
  return undefined;
};

/** DT Person: Popolo-compatible superset focused on name handling */
export const DtPersonSchema = PopoloPersonSchema.extend({
  id: z.string(),
  // Canonical (preferred) fields
  given_names: z.array(z.string()).optional()
    .describe("Ordered given/first names."),
  family_names: z.array(z.string()).optional()
    .describe("Ordered family/surnames (supports multiple)."),

  // Convenience inputs we normalize from
  given_name: z.string().optional().describe("Single given name; normalized into given_names."),
  family_name: z.string().optional().describe("Single family name; normalized into family_names."),

  // Denormalized memberships for easier access
  memberships: z.object({
    parliament: z.array(DtMembershipSchema).optional().describe("Membership in a parliamentary term."),
    groups: z.array(DtMembershipSchema).optional().describe("Membership in parliamentary groups."),
    candidate_list: z.array(DtMembershipSchema).optional().describe("Membership on a candidate list."),
    constituency: z.array(DtMembershipSchema).optional().describe("Representation of a constituency."),
  }).optional(),
})
  // Normalize singular and comma-separated to arrays
  .transform((v) => {
    const given_names = v.given_names ?? toStringArray(v.given_name);
    const family_names = v.family_names ?? toStringArray(v.family_name);
    return { ...v, given_names, family_names };
  })
  // Consistency checks if both singular & plural were provided
  .refine((v) => {
    if (v.given_name && v.given_names?.length) return v.given_names[0] === v.given_name;
    return true;
  }, { message: "given_name must equal the first element of given_names", path: ["given_name"] })
  .refine((v) => {
    if (v.family_name && v.family_names?.length) return v.family_names[0] === v.family_name;
    return true;
  }, { message: "family_name must equal the first element of family_names", path: ["family_name"] });

export type DtPerson = z.infer<typeof DtPersonSchema>;
