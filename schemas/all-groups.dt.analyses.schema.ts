import { z } from "zod";
import { DtOrganizationSchema } from "./organization.dt.schema";

export const DtAnalysesAllGroupsSchema = z.array(DtOrganizationSchema).refine((orgs) => {
  const ids = orgs.map(o => o.id).filter(Boolean);
  return new Set(ids).size === ids.length;
}, {
  message: "Organization IDs must be unique within the list.",
});

export type DtAnalysesAllGroups = z.infer<typeof DtAnalysesAllGroupsSchema>;
