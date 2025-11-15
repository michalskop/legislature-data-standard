import { z } from "zod";
import { PopoloMembershipSchema } from "./membership.popolo.schema";

/**
 * DT Membership: A Popolo-compatible superset for memberships.
 * At this stage, it is a direct extension of the Popolo Membership schema.
 */
export const DtMembershipSchema = z.intersection(
  PopoloMembershipSchema,
  z.object({
    // Future DT-specific fields will go here
  })
);

export type DtMembership = z.infer<typeof DtMembershipSchema>;
