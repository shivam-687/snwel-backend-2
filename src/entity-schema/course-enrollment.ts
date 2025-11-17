import { z } from "zod";

const enrollmentApplicantSchema = z.object({
    name: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.any().optional(),
});

export const createCourseEnrollment = z.object({
    userId: z.string().optional(),
    courseId: z.string(),
    status: z.enum(['ACTIVE', 'PENDING', 'DECLINED']).default('PENDING').optional(),
    paymentStatus: z.enum(['PAID', 'PENDING', 'FAILED']).default('PENDING').optional(),
    paymentMethod: z.enum(['CASH', 'EXTERNAL', 'INAPP']).optional(),
    expiredAt: z.string().optional(),
    extra: z.object({
        agree: z.boolean(),
    }),
    qualification: z.string(),
    mode: z.string(),
    occupation: z.string(),
    widget: z.string().optional(),
    applicant: enrollmentApplicantSchema.optional(),
})
export const updateCourseEnrollment = z.object({
    _id: z.string()
}).merge(createCourseEnrollment);

export const createEnrollmentAnonymously = z.object({
    name: z.string().min(2, { message: "Username must be at least 2 characters." }),
    email: z.string().email(),
    courseId: z.string(),
    phone: z.string(),
    location: z.object({
        addr: z.string().optional(),
        city: z.string(),
        state: z.string(),
        country: z.string()
    }),
    extra: z.object({
        agree: z.boolean(),
    }),
    qualification: z.string(),
    mode: z.string(),
    occupation: z.string(),
    widget: z.string().optional()
})

export type CreateEnrollmentAnonymously = z.infer<typeof createEnrollmentAnonymously>;
export type CreateCourseQuery = z.infer<typeof createCourseEnrollment>;
export type UpdateCourseQuery = z.infer<typeof updateCourseEnrollment>;


