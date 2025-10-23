import { z } from "zod";
const Identifier = z.object({ scheme: z.string(), identifier: z.string() });
const NameObject = z.object({
  name: z.string(),
  note: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional()
});
const Link = z.object({ url: z.string().url(), note: z.string().optional() });
const Source = z.object({ url: z.string().url(), note: z.string().optional() });
/** Popolo Area */
export const PopoloAreaSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  other_names: z.array(NameObject).optional(),
  identifiers: z.array(Identifier).optional(),
  classification: z.string().optional().describe("e.g., constituency, district, region"),
  parent_id: z.string().optional(),
  geometry: z.any().optional().describe("GeoJSON object"),
  bbox: z.array(z.number()).length(4).optional().describe("[west, south, east, north]"),
  links: z.array(Link).optional(),
  sources: z.array(Source).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});
export type PopoloArea = z.infer<typeof PopoloAreaSchema>;
