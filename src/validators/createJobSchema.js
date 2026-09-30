import * as z from "zod";

const createJobSchema = z.object({
  title: z.string().trim().min(1, "Job title is required"),

  description: z.string().trim().min(1, "Job description is required"),

  location: z.string().trim().min(1, "Location is required"),

  salary_min: z.coerce.number().positive("Please mention minimum salary"),

  salary_max: z.coerce.number().positive("Please mention maximum salary"),
});

export { createJobSchema };
