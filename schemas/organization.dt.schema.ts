import { z } from "zod";
import { PopoloOrganizationSchema } from "./organization.popolo.schema";

/**
 * DT Organization: A Popolo-compatible superset for organizations.
 * At this stage, it is a direct extension of the Popolo Organization schema.
 */
export const DtOrganizationSchema = PopoloOrganizationSchema.extend({
  // Future DT-specific fields will go here
});

export type DtOrganization = z.infer<typeof DtOrganizationSchema>;
