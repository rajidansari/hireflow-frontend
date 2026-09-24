import * as z from "zod";

const employerProfileSchema = z.object({
  fullname: z.string().min(3, { error: "Fullname must be atleast 3 characters long" }).optional(),
  company_name: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  bio: z.string().max(700, { error: "Limit exceeds" }).optional(),
  location: z.string().min(3, { error: "Location must be 3 characters long" }),
});

export { employerProfileSchema };
