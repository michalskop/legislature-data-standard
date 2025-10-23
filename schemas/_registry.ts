import { PopoloPersonSchema } from "./person.popolo.schema";
import { PopoloOrganizationSchema } from "./organization.popolo.schema";
import { PopoloMembershipSchema } from "./membership.popolo.schema";
import { PopoloPostSchema } from "./post.popolo.schema";

export type SchemaItem = {
  name: string;
  fileBase: string;
  zod: any;
  example?: any;
};

export const REGISTRY: SchemaItem[] = [
  { name: "PopoloPerson",       fileBase: "person.popolo",       zod: PopoloPersonSchema },
  { name: "PopoloOrganization", fileBase: "organization.popolo", zod: PopoloOrganizationSchema },
  { name: "PopoloMembership",   fileBase: "membership.popolo",   zod: PopoloMembershipSchema },
  { name: "PopoloPost",         fileBase: "post.popolo",         zod: PopoloPostSchema }
];

export default REGISTRY;
