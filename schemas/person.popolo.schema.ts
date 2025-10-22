import { z } from "zod";

const Link = z.object({
  url: z.string().url(),
  note: z.string().optional()
});
const Source = z.object({
  url: z.string().url(),
  note: z.string().optional()
});
const Identifier = z.object({
  scheme: z.string(),
  identifier: z.string()
});
const ContactDetail = z.object({
  type: z.string(),          // e.g. "email", "phone", "address"
  value: z.string(),
  label: z.string().optional(),
  note: z.string().optional()
});
const OtherName = z.object({
  name: z.string(),
  note: z.string().optional(),
  start_date: z.string().optional(), // YYYY-MM-DD
  end_date: z.string().optional()
});

export const PopoloPersonSchema = z.object({
  id: z.string().optional(),
  name: z.string().describe("Canonical display name."),
  other_names: z.array(OtherName).optional(),
  identifiers: z.array(Identifier).optional(),
  email: z.string().email().optional(),
  gender: z.string().optional(),
  pronouns: z.string().optional(),
  birth_date: z.string().optional(),   // YYYY-MM-DD
  death_date: z.string().optional(),
  image: z.string().url().optional(),
  summary: z.string().optional(),
  biography: z.string().optional(),
  national_identity: z.string().optional(),
  contact_details: z.array(ContactDetail).optional(),
  links: z.array(Link).optional(),
  sources: z.array(Source).optional(),
  created_at: z.string().optional(),   // ISO-8601 datetime
  updated_at: z.string().optional()
});

export type PopoloPerson = z.infer<typeof PopoloPersonSchema>;
