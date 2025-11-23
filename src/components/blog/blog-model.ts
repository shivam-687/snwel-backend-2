// src/models/Blog.ts

import { paginateOptions } from '@/config/common';
import mongoose, { Schema, model, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseDelete, { SoftDeleteModel, SoftDeleteDocument } from 'mongoose-delete';
import { ObjectId } from 'mongodb';

mongoosePaginate.paginate.options = paginateOptions;

export interface IBlog extends SoftDeleteDocument {
  title: string;
  slug: string;
  content: string;
  author: ObjectId;
  coverImage?: string,
  excerpt?: string,
  tags: string[];
  category: ObjectId,
  published: boolean;
  publishedAt?: Date;
  isFeatured: boolean; // New field
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  slug: { type: String },
  content: { type: String, required: true },
  coverImage: { type: String },
  excerpt: { type: String },
  author: { type: Schema.ObjectId, required: true, ref: "User" },
  tags: { type: [String], default: [] },
  published: { type: Boolean, default: false },
  publishedAt: { type: Date },
  isFeatured: { type: Boolean, default: false }, // New field
  views: { type: Number, default: 0 },
  category: { type: Schema.ObjectId, default: null, ref: 'BlogCategory' }
}, { timestamps: true });

// Indexes for performance
blogSchema.index({ published: 1, createdAt: -1 }); // For default listing
blogSchema.index({ isFeatured: 1, published: 1 }); // For featured blogs
blogSchema.index({ tags: 1, published: 1 }); // For similar blogs by tags
blogSchema.index({ category: 1, published: 1 }); // For similar blogs by category
blogSchema.index({ slug: 1 }); // For lookup by slug

blogSchema.plugin(mongoosePaginate);
blogSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

const Blog = model<IBlog, mongoose.PaginateModel<IBlog> & SoftDeleteModel<IBlog>>('Blog', blogSchema);

export default Blog;
