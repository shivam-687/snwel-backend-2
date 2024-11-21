import mongoose, { Document, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { paginateOptions } from '@/config/common';

mongoosePaginate.paginate.options = paginateOptions;

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  price: number;
  discountedPrice?: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: mongoose.Types.ObjectId;
  tags: string[];
  instructor: mongoose.Types.ObjectId;
  syllabus: {
    title: string;
    description: string;
    duration: string;
    order: number;
  }[];
  isPublished: boolean;
  isActive: boolean;
  enrollmentCount: number;
  rating: number;
  ratingCount: number;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
}

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  thumbnail: { type: String, required: true },
  price: { type: Number, required: true },
  discountedPrice: { type: Number },
  duration: { type: String, required: true },
  level: { 
    type: String, 
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  category: { 
    type: Schema.Types.ObjectId, 
    ref: 'CourseCategory',
    required: true 
  },
  tags: [{ type: String }],
  instructor: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  syllabus: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    order: { type: Number, required: true }
  }],
  isPublished: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  enrollmentCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
CourseSchema.index({ title: 'text', description: 'text' });
CourseSchema.index({ slug: 1 });
CourseSchema.index({ category: 1 });
CourseSchema.index({ instructor: 1 });
CourseSchema.index({ isPublished: 1, isActive: 1 });

// Plugins
CourseSchema.plugin(mongoosePaginate);

export const CourseModel = mongoose.model<ICourse, mongoose.PaginateModel<ICourse>>('Course', CourseSchema); 