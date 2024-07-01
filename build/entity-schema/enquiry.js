"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEnquiry = exports.createEnquiry = void 0;
const zod_1 = require("zod");
const GeneralEnquiry = zod_1.z.object({
    message: zod_1.z.string().optional()
});
const WebinarEnquiry = zod_1.z.object({
    webinarId: zod_1.z.string(),
    message: zod_1.z.string().optional(),
    location: zod_1.z.object({
        country: zod_1.z.string(),
        city: zod_1.z.string(),
        state: zod_1.z.string(),
        address: zod_1.z.string()
    }).optional()
});
exports.createEnquiry = zod_1.z.object({
    fullName: zod_1.z.string(),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().min(10).max(15),
    message: zod_1.z.string().optional(),
    type: zod_1.z.enum(['general', 'job', 'support', 'webinar', 'contact']), // Add more types as needed
    extraInfo: zod_1.z.union([GeneralEnquiry, WebinarEnquiry]).optional(),
    isUnique: zod_1.z.boolean().optional()
});
exports.updateEnquiry = exports.createEnquiry.merge(zod_1.z.object({ _id: zod_1.z.string() }));
