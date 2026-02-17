import { z } from "zod";
import { DtTermSchema } from "./term.dt.schema";

/** DT analysis: Current term (DtTerm or null if unknown) */
export const DtAnalysesCurrentTermSchema = z.union([DtTermSchema, z.null()]);

export type DtAnalysesCurrentTerm = z.infer<typeof DtAnalysesCurrentTermSchema>;
