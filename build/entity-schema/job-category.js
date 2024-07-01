"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJobCategorySchema = exports.createJobCategorySchema = void 0;
const zod_1 = require("zod");
exports.createJobCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    description: zod_1.z.string().optional(),
});
exports.updateJobCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required").optional(),
    description: zod_1.z.string().optional(),
});
