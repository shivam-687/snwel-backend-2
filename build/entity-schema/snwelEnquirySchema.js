"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEnquirySchema = exports.createEnquirySchema = void 0;
const zod_1 = require("zod");
exports.createEnquirySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    businessEmail: zod_1.z.string().email("Invalid email address"),
    company: zod_1.z.string().min(1, "Company name is required"),
    enquiryType: zod_1.z.string(),
    mobileNo: zod_1.z.string().min(10, "Mobile number must be at least 10 characters long"),
    description: zod_1.z.string().max(200, "Description must be at most 200 characters"),
    consentGiven: zod_1.z.boolean().refine((value) => value === true, "Consent must be given"),
    otpValidated: zod_1.z.boolean().refine((value) => value === true, "OTP must be validated"),
});
exports.updateEnquirySchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    businessEmail: zod_1.z.string().email().optional(),
    company: zod_1.z.string().min(1).optional(),
    enquiryType: zod_1.z.string().optional(),
    mobileNo: zod_1.z.string().min(10).optional(),
    description: zod_1.z.string().max(200).optional(),
    consentGiven: zod_1.z.boolean().optional(),
    otpValidated: zod_1.z.boolean().optional(),
});
