import { z } from 'zod';

// Schema for creating a digital asset
export const createGalleryAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  link: z.string().url("Invalid URL format").min(1, "URL is required"),
  linkType: z.enum(['image', 'video', 'youtube']).default('image'),
  likesCount: z.number().default(0),
  extension: z.string().optional(),
  sequence: z.number().optional(),
});

// TypeScript type derived from the schema
export type CreateFGalleryAssetSchema = z.infer<typeof createGalleryAssetSchema>;

// Schema for updating a digital asset
export const updateGalleryAssetSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  link: z.string().url("Invalid URL format").optional(),
  linkType: z.enum(['image', 'video', 'youtube']).optional(),
  likesCount: z.number().optional(),
  extension: z.string().optional(),
  sequence: z.number().optional(),
});

// TypeScript type derived from the schema
export type UpdateGalleryAssetSchema = z.infer<typeof updateGalleryAssetSchema>;
