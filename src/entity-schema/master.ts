import { Constants } from '@/config/constants';
import { z } from 'zod';

const masterSchema = z.object({
  code: z.string().min(1, "Code is required"),
  parentCode: z.string().optional(),
  isActive: z.boolean().default(true),
  name: z.string().min(1, "Name is required"),
  meta: z.record(z.string(), z.any()).optional(),
  type: z.enum([Constants.MASTER_TYPES.MASTER, Constants.MASTER_TYPES.SUB_MASTER])
});

// Schema for creating a new master item
export const createMasterItemSchema = masterSchema;

// TypeScript type derived from the create schema
export type CreateMasterItemSchema = z.infer<typeof createMasterItemSchema>;

// Schema for updating an existing master item
export const updateMasterItemSchema = masterSchema.partial().extend({
  code: z.string().min(1, "Code is required").optional(),
});

// TypeScript type derived from the update schema
export type UpdateMasterItemSchema = z.infer<typeof updateMasterItemSchema>;
