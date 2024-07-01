"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJobVacancySchema = exports.createJobVacancySchema = void 0;
const zod_1 = require("zod");
const locationSchema = zod_1.z.object({
    country: zod_1.z.string().min(1, "Country is required"),
    state: zod_1.z.string().min(1, "State is required"),
    city: zod_1.z.string().min(1, "City is required"),
    address: zod_1.z.string().min(1, "Address is required"),
    zipcode: zod_1.z.string().min(1, "Zipcode is required"),
});
exports.createJobVacancySchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    companyName: zod_1.z.string().min(1, "Company name is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    requirements: zod_1.z.string().min(1, "Requirements are required"),
    location: locationSchema.optional(),
    salaryRange: zod_1.z.string().min(1, "Salary range is required"),
    employmentType: zod_1.z.enum(['full-time', 'part-time', 'contract', 'temporary']),
    applicationDeadline: zod_1.z.string(),
    categories: zod_1.z.array(zod_1.z.string().min(1, "Category ID is required")),
    postedDate: zod_1.z.string().default(new Date().toUTCString()),
    contactInfo: zod_1.z.string().min(1, "Contact info is required").optional(),
    experienceLevel: zod_1.z.enum(['entry-level', 'mid-level', 'senior-level']),
    companyLogo: zod_1.z.string().optional(),
    additionalInfo: zod_1.z.string().optional(),
    status: zod_1.z.enum(['open', 'closed', 'filled']).default('open'),
    remoteWorkOption: zod_1.z.boolean().default(false),
    benefits: zod_1.z.string().optional(),
    applicationLink: zod_1.z.string().optional(),
});
exports.updateJobVacancySchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").optional(),
    companyName: zod_1.z.string().min(1, "Company name is required").optional(),
    description: zod_1.z.string().min(1, "Description is required").optional(),
    requirements: zod_1.z.string().min(1, "Requirements are required").optional(),
    location: locationSchema.partial().optional(),
    salaryRange: zod_1.z.string().min(1, "Salary range is required").optional(),
    employmentType: zod_1.z.enum(['full-time', 'part-time', 'contract', 'temporary']).optional(),
    applicationDeadline: zod_1.z.string().optional(),
    categories: zod_1.z.array(zod_1.z.string().min(1, "Category ID is required")).optional(),
    postedDate: zod_1.z.string().optional(),
    contactInfo: zod_1.z.string().min(1, "Contact info is required").optional(),
    experienceLevel: zod_1.z.enum(['entry-level', 'mid-level', 'senior-level']).optional(),
    companyLogo: zod_1.z.string().optional(),
    additionalInfo: zod_1.z.string().optional(),
    status: zod_1.z.enum(['open', 'closed', 'filled']).optional(),
    remoteWorkOption: zod_1.z.boolean().optional(),
    benefits: zod_1.z.string().optional(),
    applicationLink: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
    isFeatured: zod_1.z.boolean().optional()
});
