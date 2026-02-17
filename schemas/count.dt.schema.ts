import { z } from "zod";
import { PopoloCountSchema } from "./count.popolo.schema";

export const DtCountSchema = PopoloCountSchema.extend({
  option: z.string().describe(
    "Vote option. Recommended: yes, no, abstain, not voting, absent, secret, unknown. Other values allowed."
  ),
});

export type DtCount = z.infer<typeof DtCountSchema>;
