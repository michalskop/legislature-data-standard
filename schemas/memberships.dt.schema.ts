import { z } from "zod";
import { DtMembershipSchema } from "./membership.dt.schema";

/** DT Memberships: A list of memberships */
export const DtMembershipsSchema = z.array(DtMembershipSchema);

export type DtMemberships = z.infer<typeof DtMembershipsSchema>;
