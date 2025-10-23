import { z } from "zod";

const Link = z.object({ url: z.string().url(), note: z.string().optional() });
const Source = z.object({ url: z.string().url(), note: z.string().optional() });
const ContactDetail = z.object({
  type: z.string(),
  value: z.string(),
  label: z.string().optional(),
  note: z.string().optional()
});

/** Popolo Membership (JSON serialization) */
export const PopoloMembershipSchema = z.object({
  id: z.string().optional(),

  label: z.string().optional().describe("Label describing the membership."),
  role: z.string().optional().describe("The role fulfilled (string)."),

  // The member can be a person or an organization; common case uses person/person_id
  member_id: z.string().optional().describe("If the member is an org, its ID."),
  person_id: z.string().optional().describe("If the member is a person, their ID."),
  organization_id: z.string().optional().describe("Organization in which the person/org is a member."),
  post_id: z.string().optional().describe("Post held by the member (optional)."),
  on_behalf_of_id: z.string().optional().describe("Org on whose behalf the person is a member."),
  area_id: z.string().optional().describe("Related geographic area ID."),

  start_date: z.string().optional().describe("YYYY-MM-DD start."),
  end_date: z.string().optional().describe("YYYY-MM-DD end."),

  contact_details: z.array(ContactDetail).optional(),
  links: z.array(Link).optional(),
  sources: z.array(Source).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
})
  .refine((v) => !!(v.member_id || v.person_id), {
    message: "Membership must set member/person/person_id.",
    path: ["member_id"]
  })
  .refine((v) => !!(v.organization_id || v.post_id), {
    message: "Membership must set organization/organization_id or post/post_id.",
    path: ["organization_id"]
  });

export type PopoloMembership = z.infer<typeof PopoloMembershipSchema>;
