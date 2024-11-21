import mongoose, { Document, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { paginateOptions } from '@/config/common';

mongoosePaginate.paginate.options = paginateOptions;

export interface ICourseCategory extends Document {
  name: string;
  slug: string;
  description: string;
  icon?: string;
  isActive: boolean;
  parentCategory?: mongoose.Types.ObjectId;
  order: number;
}

const CourseCategorySchema = new Schema<ICourseCategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String },
  isActive: { type: Boolean, default: true },
  parentCategory: { 
    type: Schema.Types.ObjectId, 
    ref: 'CourseCategory'
  },
  order: { type: Number, default: 0 }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
CourseCategorySchema.index({ name: 'text' });
CourseCategorySchema.index({ slug: 1 });
CourseCategorySchema.index({ parentCategory: 1 });
CourseCategorySchema.index({ order: 1 });

// Plugins
CourseCategorySchema.plugin(mongoosePaginate);

export const CourseCategoryModel = mongoose.model<ICourseCategory, mongoose.PaginateModel<ICourseCategory>>('CourseCategory', CourseCategorySchema); 