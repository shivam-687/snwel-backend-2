import { z } from 'zod';

export const createJobCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

// TypeScript type derived from the schema
export type CreateJobCategorySchema = z.infer<typeof createJobCategorySchema>;


export const updateJobCategorySchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().optional(),
  });
  
  // TypeScript type derived from the schema
  export type UpdateJobCategorySchema = z.infer<typeof updateJobCategorySchema>;