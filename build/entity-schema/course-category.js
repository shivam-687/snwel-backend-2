"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourseCategory = exports.createCourseCategory = void 0;
const zod_1 = require("zod");
exports.createCourseCategory = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    shortDescription: zod_1.z.string(),
    isPremium: zod_1.z.boolean().optional().default(false),
    parentCategory: zod_1.z.string().optional(),
    slug: zod_1.z.string()
});
exports.updateCourseCategory = zod_1.z.object({
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    shortDescription: zod_1.z.string().optional(),
    isPremium: zod_1.z.boolean().optional(),
    parentCategory: zod_1.z.string().optional(),
    slug: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional()
});
