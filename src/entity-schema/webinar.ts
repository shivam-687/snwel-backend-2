import { z } from "zod";

export const createWebinar = z.object({
    title: z.string(),
    shortDescription: z.string().optional(),
    content: z.string(),
    startDate: z.date(),
    slug: z.string(),
    thumbnail: z.string().optional(),
    hosts: z.array(z.string()),
    createdBy: z.string().optional()
});


export const updateWebinar = createWebinar.merge(z.object({_id: z.string()}));


export type CreateWebinarType = z.infer<typeof createWebinar>;
export type UpdateWebinarType = z.infer<typeof updateWebinar>;
