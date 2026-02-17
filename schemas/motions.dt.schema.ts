import { z } from "zod";
import { DtMotionSchema } from "./motion.dt.schema";

export const DtMotionsSchema = z.array(DtMotionSchema).refine((motions) => {
  const ids = motions.map(m => m.id).filter(Boolean);
  return new Set(ids).size === ids.length;
}, {
  message: "Motion IDs must be unique within the list.",
});

export type DtMotions = z.infer<typeof DtMotionsSchema>;
