// src/entity-schema/enquiry.ts

import { z } from 'zod';

// Schema for creating a new enquiry
export const createEnquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  businessEmail: z.string().email("Invalid email address"),
  company: z.string().min(1, "Company name is required"),
  enquiryType: z.string(),
  mobileNo: z.string().min(10, "Mobile number must be at least 10 characters long"),
  description: z.string().max(200, "Description must be at most 200 characters"),
  consentGiven: z.boolean().refine((value) => value === true, "Consent must be given"),
  otpValidated: z.boolean().refine((value) => value === true, "OTP must be validated"),
});

// Schema for updating an existing enquiry
export const updateEnquirySchema = z.object({
  name: z.string().min(1).optional(),
  businessEmail: z.string().email().optional(),
  company: z.string().min(1).optional(),
  enquiryType: z.string().optional(),
  mobileNo: z.string().min(10).optional(),
  description: z.string().max(200).optional(),
  consentGiven: z.boolean().optional(),
  otpValidated: z.boolean().optional(),
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
export type UpdateEnquiryInput = z.infer<typeof updateEnquirySchema>;
