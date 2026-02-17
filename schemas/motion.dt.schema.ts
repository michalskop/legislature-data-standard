import { z } from "zod";
import { PopoloMotionSchema } from "./motion.popolo.schema";

export const DtMotionSchema = PopoloMotionSchema.extend({
  id: z.string().describe("Motion ID."),
});

export type DtMotion = z.infer<typeof DtMotionSchema>;
