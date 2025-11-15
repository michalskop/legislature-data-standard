import { z } from "zod";
import { DtOrganizationSchema } from "./organization.dt.schema";

/** DT Organizations: A list of organizations with unique IDs */
export const DtOrganizationsSchema = z.array(DtOrganizationSchema).refine((orgs) => {
  const ids = orgs.map(o => o.id).filter(Boolean); // Filter out potential undefined IDs
  return new Set(ids).size === ids.length;
}, {
  message: "Organization IDs must be unique within the list.",
});

export type DtOrganizations = z.infer<typeof DtOrganizationsSchema>;
