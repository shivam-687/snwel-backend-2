// src/models/BlogCategory.ts

import { paginateOptions } from '@/config/common';
import mongoose, { Schema, model, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseDelete, { SoftDeleteModel, SoftDeleteDocument } from 'mongoose-delete';

mongoosePaginate.paginate.options = paginateOptions;

export interface IBlogCategory extends SoftDeleteDocument {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogCategorySchema = new Schema<IBlogCategory>({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Middleware to update `updatedAt` before each save
blogCategorySchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for faster search queries
blogCategorySchema.index({ slug: 1 });

// Add plugins for pagination and soft delete functionality
blogCategorySchema.plugin(mongoosePaginate);
blogCategorySchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

const BlogCategory = model<IBlogCategory, mongoose.PaginateModel<IBlogCategory>&SoftDeleteModel<IBlogCategory>>('BlogCategory', blogCategorySchema);

export default BlogCategory;
