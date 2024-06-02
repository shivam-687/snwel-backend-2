"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWebinar = exports.createWebinar = void 0;
const zod_1 = require("zod");
exports.createWebinar = zod_1.z.object({
    title: zod_1.z.string(),
    shortDescription: zod_1.z.string().optional(),
    content: zod_1.z.string(),
    startDate: zod_1.z.date(),
    slug: zod_1.z.string(),
    thumbnail: zod_1.z.string().optional(),
    hosts: zod_1.z.array(zod_1.z.string()),
    createdBy: zod_1.z.string().optional()
});
exports.updateWebinar = exports.createWebinar.merge(zod_1.z.object({ _id: zod_1.z.string() }));
