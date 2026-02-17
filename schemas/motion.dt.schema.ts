import { z } from "zod";
import { PopoloMotionSchema } from "./motion.popolo.schema";

export const DtMotionSchema = PopoloMotionSchema.extend({
  id: z.string().describe("Motion ID."),
  extras: z.record(z.any()).optional().describe("Additional metadata fields not covered by the core schema (e.g., sitting number, agenda item)."),
});

export type DtMotion = z.infer<typeof DtMotionSchema>;
