"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJobApplicationSchema = exports.createJobApplicationSchema = void 0;
const zod_1 = require("zod");
exports.createJobApplicationSchema = zod_1.z.object({
    jobId: zod_1.z.string().min(1, "Job ID is required"),
    applicantName: zod_1.z.string().min(1, "Applicant name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    phone: zod_1.z.string().optional(),
    resumeUrl: zod_1.z.string().url("Invalid URL for resume"),
    coverLetter: zod_1.z.string().optional(),
    status: zod_1.z.enum(['applied', 'interview', 'offered', 'rejected']).default('applied'),
    appliedDate: zod_1.z.date().default(() => new Date()),
    notes: zod_1.z.string().optional(),
});
exports.updateJobApplicationSchema = zod_1.z.object({
    jobId: zod_1.z.string().min(1, "Job ID is required").optional(),
    applicantName: zod_1.z.string().min(1, "Applicant name is required").optional(),
    email: zod_1.z.string().email("Invalid email address").optional(),
    resumeUrl: zod_1.z.string().url("Invalid URL for resume").optional(),
    coverLetter: zod_1.z.string().optional(),
    status: zod_1.z.enum(['applied', 'interview', 'offered', 'rejected']).optional(),
    appliedDate: zod_1.z.date().optional(),
    notes: zod_1.z.string().optional(),
});
