import { z } from "zod";
const Link = z.object({ url: z.string().url(), note: z.string().optional() });
const Source = z.object({ url: z.string().url(), note: z.string().optional() });
/** Popolo Speech */
export const PopoloSpeechSchema = z.object({
  id: z.string().optional(),
  text: z.string().describe("Transcript text"),
  audio: z.string().url().optional(),
  video: z.string().url().optional(),
  speaker_id: z.string().optional().describe("Person id of the speaker"),
  on_behalf_of_id: z.string().optional().describe("Organization on whose behalf the speech is made"),
  event_id: z.string().optional().describe("Related Event id"),
  date: z.string().optional().describe("YYYY-MM-DD or ISO datetime"),
  language: z.string().optional(),
  links: z.array(Link).optional(),
  sources: z.array(Source).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});
export type PopoloSpeech = z.infer<typeof PopoloSpeechSchema>;
