import { z } from "zod";

const GeneralEnquiry = z.object({
  message: z.string().optional()
})

const WebinarEnquiry = z.object({
  webinarId: z.string(),
  message: z.string().optional(),
  location: z.object({
    country: z.string(),
    city: z.string(),
    state: z.string(),
    address: z.string()
  }).optional()
});


export const createEnquiry = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  message: z.string().optional(),
  type: z.enum(['general', 'job', 'support', 'webinar', 'contact']), // Add more types as needed
  extraInfo: z.union([GeneralEnquiry, WebinarEnquiry]).optional(),
  isUnique: z.boolean().optional()
});

export const updateEnquiry = createEnquiry.merge(z.object({ _id: z.string() }));

export type CreateEnquiryType = z.infer<typeof createEnquiry>;
export type UpdateEnquiryType = z.infer<typeof updateEnquiry>;
