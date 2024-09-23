"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGalleryAssetSchema = exports.createGalleryAssetSchema = void 0;
const zod_1 = require("zod");
// Schema for creating a digital asset
exports.createGalleryAssetSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    description: zod_1.z.string().optional(),
    link: zod_1.z.string().url("Invalid URL format").min(1, "URL is required"),
    linkType: zod_1.z.enum(['image', 'video', 'youtube']).default('image'),
    likesCount: zod_1.z.number().default(0),
    extension: zod_1.z.string().optional(),
    sequence: zod_1.z.number().optional(),
});
// Schema for updating a digital asset
exports.updateGalleryAssetSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required").optional(),
    description: zod_1.z.string().optional(),
    link: zod_1.z.string().url("Invalid URL format").optional(),
    linkType: zod_1.z.enum(['image', 'video', 'youtube']).optional(),
    likesCount: zod_1.z.number().optional(),
    extension: zod_1.z.string().optional(),
    sequence: zod_1.z.number().optional(),
});
