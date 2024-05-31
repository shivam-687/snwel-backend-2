import { z } from "zod";

export const createCourseCategory = z.object({
    title: z.string(),
    description: z.string(),
    shortDescription: z.string(),
    isPremium: z.boolean().optional().default(false),
    parentCategory: z.string().optional(),
    slug: z.string()
});

export const updateCourseCategory = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    shortDescription: z.string().optional(),
    isPremium: z.boolean().optional(),
    parentCategory: z.string().optional(),
    slug: z.string().optional(),
    isActive: z.boolean().optional()
});

export type CreateCourseCategory = z.infer<typeof createCourseCategory>;
export type UpdateCourseCategory = z.infer<typeof updateCourseCategory>;
