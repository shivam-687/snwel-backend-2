import { z } from 'zod';

// Schema for creating a job application
export const createJobApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  applicantName: z.string().min(1, "Applicant name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  resumeUrl: z.string().url("Invalid URL for resume"),
  coverLetter: z.string().optional(),
  status: z.enum(['applied', 'interview', 'offered', 'rejected']).default('applied'),
  appliedDate: z.date().default(() => new Date()),
  notes: z.string().optional(),
});

// TypeScript type derived from the schema
export type CreateJobApplicationSchema = z.infer<typeof createJobApplicationSchema>;

// Schema for updating a job application
export const updateJobApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required").optional(),
  applicantName: z.string().min(1, "Applicant name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  resumeUrl: z.string().url("Invalid URL for resume").optional(),
  coverLetter: z.string().optional(),
  status: z.enum(['applied', 'interview', 'offered', 'rejected']).optional(),
  appliedDate: z.date().optional(),
  notes: z.string().optional(),
});

// TypeScript type derived from the schema
export type UpdateJobApplicationSchema = z.infer<typeof updateJobApplicationSchema>;
