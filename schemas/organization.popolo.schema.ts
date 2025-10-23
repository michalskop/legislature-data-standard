import { z } from "zod";

/** Re-used Popolo helpers (same shapes as in Person) */
const Link = z.object({ url: z.string().url(), note: z.string().optional() });
const Source = z.object({ url: z.string().url(), note: z.string().optional() });
const Identifier = z.object({ scheme: z.string(), identifier: z.string() });
const NameObject = z.object({
  name: z.string(),
  note: z.string().optional(),
  start_date: z.string().optional(), // YYYY-MM-DD
  end_date: z.string().optional()
});
const ContactDetail = z.object({
  type: z.string(),        // e.g. "email", "phone", "address"
  value: z.string(),
  label: z.string().optional(),
  note: z.string().optional()
});

/** Popolo Organization (JSON serialization) */
export const PopoloOrganizationSchema = z.object({
  id: z.string().optional(),
  name: z.string().describe("Primary name."),
  other_names: z.array(NameObject).optional().describe("Alternate and former names."),
  identifiers: z.array(Identifier).optional(),
  classification: z.string().optional().describe("Organizational category, e.g., committee, party."),
  parent: z.string().optional().describe("Human name or object ref (use parent_id for linkage)."),
  parent_id: z.string().optional().describe("ID of the parent org."),
  area_id: z.string().optional().describe("Related geographic area ID."),
  summary: z.string().optional().describe("One-line description."),
  description: z.string().optional().describe("Longer description."),
  founding_date: z.string().optional().describe("YYYY-MM-DD."),
  dissolution_date: z.string().optional().describe("YYYY-MM-DD."),
  image: z.string().url().optional(),
  contact_details: z.array(ContactDetail).optional(),
  links: z.array(Link).optional(),
  sources: z.array(Source).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

export type PopoloOrganization = z.infer<typeof PopoloOrganizationSchema>;
