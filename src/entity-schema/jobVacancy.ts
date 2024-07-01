import { z } from 'zod';

const locationSchema = z.object({
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  zipcode: z.string().min(1, "Zipcode is required"),
});

export const createJobVacancySchema = z.object({
  title: z.string().min(1, "Title is required"),
  companyName: z.string().min(1, "Company name is required"),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().min(1, "Requirements are required"),
  location: locationSchema.optional(),
  salaryRange: z.string().min(1, "Salary range is required"),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'temporary']),
  applicationDeadline: z.string(),
  categories: z.array(z.string().min(1, "Category ID is required")),
  postedDate: z.string().default(new Date().toUTCString()),
  contactInfo: z.string().min(1, "Contact info is required").optional(),
  experienceLevel: z.enum(['entry-level', 'mid-level', 'senior-level']),
  companyLogo: z.string().optional(),
  additionalInfo: z.string().optional(),
  status: z.enum(['open', 'closed', 'filled']).default('open'),
  remoteWorkOption: z.boolean().default(false),
  benefits: z.string().optional(),
  applicationLink: z.string().optional(),

});

// TypeScript type derived from the schema
export type CreateJobVacancySchema = z.infer<typeof createJobVacancySchema>;


export const updateJobVacancySchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    companyName: z.string().min(1, "Company name is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    requirements: z.string().min(1, "Requirements are required").optional(),
    location: locationSchema.partial().optional(),
    salaryRange: z.string().min(1, "Salary range is required").optional(),
    employmentType: z.enum(['full-time', 'part-time', 'contract', 'temporary']).optional(),
    applicationDeadline: z.string().optional(),
    categories: z.array(z.string().min(1, "Category ID is required")).optional(),
    postedDate: z.string().optional(),
    contactInfo: z.string().min(1, "Contact info is required").optional(),
    experienceLevel: z.enum(['entry-level', 'mid-level', 'senior-level']).optional(),
    companyLogo: z.string().optional(),
    additionalInfo: z.string().optional(),
    status: z.enum(['open', 'closed', 'filled']).optional(),
    remoteWorkOption: z.boolean().optional(),
    benefits: z.string().optional(),
    applicationLink: z.string().optional(),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional()
  });
  
  // TypeScript type derived from the schema
  export type UpdateJobVacancySchema = z.infer<typeof updateJobVacancySchema>;
  