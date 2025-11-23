// src/components/testimonial/testimonial-model.ts

import { paginateOptions } from '@/config/common';
import mongoose, { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseDelete, { SoftDeleteModel, SoftDeleteDocument } from 'mongoose-delete';

mongoosePaginate.paginate.options = paginateOptions;

export interface ITestimonial extends SoftDeleteDocument {
  name: string;
  position?: string;
  company?: string;
  content: string;
  avatar?: string;
  rating?: number;
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>({
  name: { type: String, required: true, trim: true },
  position: { type: String, trim: true },
  company: { type: String, trim: true },
  content: { type: String, required: true },
  avatar: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  published: { type: Boolean, default: false },
  publishedAt: { type: Date }
}, { timestamps: true });

// Indexes for performance
testimonialSchema.index({ published: 1, createdAt: -1 });

// Add plugins for pagination and soft delete functionality
testimonialSchema.plugin(mongoosePaginate);
testimonialSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

const Testimonial = model<ITestimonial, mongoose.PaginateModel<ITestimonial>&SoftDeleteModel<ITestimonial>>('Testimonial', testimonialSchema);

export default Testimonial;
