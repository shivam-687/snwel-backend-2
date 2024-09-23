"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMasterItemSchema = exports.createMasterItemSchema = void 0;
const constants_1 = require("../config/constants");
const zod_1 = require("zod");
const masterSchema = zod_1.z.object({
    code: zod_1.z.string().min(1, "Code is required"),
    parentCode: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().default(true),
    name: zod_1.z.string().min(1, "Name is required"),
    meta: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    type: zod_1.z.enum([constants_1.Constants.MASTER_TYPES.MASTER, constants_1.Constants.MASTER_TYPES.SUB_MASTER])
});
// Schema for creating a new master item
exports.createMasterItemSchema = masterSchema;
// Schema for updating an existing master item
exports.updateMasterItemSchema = masterSchema.partial().extend({
    code: zod_1.z.string().min(1, "Code is required").optional(),
});
