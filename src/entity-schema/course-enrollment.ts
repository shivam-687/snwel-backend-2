import { z } from "zod";

export const createCourseEnrollment = z.object({
    userId: z.string(),
    courseId: z.string(),
    status: z.enum(['ACTIVE', 'PENDING', 'DECLINED']).default('PENDING').optional(),
    paymentStatus: z.enum(['PAID', 'PENDING', 'FAILED']).default('PENDING').optional(),
    paymentMethod: z.enum(['CASH', 'EXTERNAL', 'INAPP']).optional(),
    expiredAt: z.string().optional()
})
export const updateCourseEnrollment = z.object({
    _id: z.string()
}).merge(createCourseEnrollment);


export const createEnrollmentAnonymously = z.object({
    email: z.string().email(),
    name: z.string(),
    location: z.object({
        addr: z.string().optional(),
        city: z.string(),
        state: z.string(),
        country: z.string()
    }).optional(),
    phone: z.string().optional(),
    courseId: z.string()
})

export type CreateEnrollmentAnonymously = z.infer<typeof createEnrollmentAnonymously>;
export type CreateCourseQuery = z.infer<typeof createCourseEnrollment>;
export type UpdateCourseQuery = z.infer<typeof updateCourseEnrollment>;


