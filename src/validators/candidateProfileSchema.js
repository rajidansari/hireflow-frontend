import * as z from "zod";

const candidateProfileSchema = z.object({
  fullname: z.string().min(3, { error: "Fullname must be atlest 3 characters long" }).optional(),
  headline: z.string().max(100, { error: "Headline can max upto 100 words" }).optional(),
  description: z.string().max(1000, { error: "Description can max upto 1000 words" }).optional(),
  location: z.string().min(3, { error: "Location must be 3 characters long" }).optional(),
  portfolioUrl: z.string().optional(),
});

export { candidateProfileSchema };
