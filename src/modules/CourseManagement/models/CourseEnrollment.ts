import mongoose, { Document, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { paginateOptions } from '@/config/common';

mongoosePaginate.paginate.options = paginateOptions;

export interface ICourseEnrollment extends Document {
  course: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  enrollmentDate: Date;
  completionDate?: Date;
  progress: number;
  status: 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentAmount: number;
  paymentId?: string;
  rating?: number;
  review?: string;
}

const CourseEnrollmentSchema = new Schema<ICourseEnrollment>({
  course: { 
    type: Schema.Types.ObjectId, 
    ref: 'Course',
    required: true 
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  enrollmentDate: { type: Date, default: Date.now },
  completionDate: { type: Date },
  progress: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentAmount: { type: Number, required: true },
  paymentId: { type: String },
  rating: { 
    type: Number,
    min: 1,
    max: 5
  },
  review: { type: String }
}, { 
  timestamps: true 
});

// Indexes
CourseEnrollmentSchema.index({ course: 1, user: 1 }, { unique: true });
CourseEnrollmentSchema.index({ user: 1 });
CourseEnrollmentSchema.index({ course: 1 });
CourseEnrollmentSchema.index({ status: 1 });
CourseEnrollmentSchema.index({ paymentStatus: 1 });

// Plugins
CourseEnrollmentSchema.plugin(mongoosePaginate);

export const CourseEnrollmentModel = mongoose.model<ICourseEnrollment, mongoose.PaginateModel<ICourseEnrollment>>('CourseEnrollment', CourseEnrollmentSchema); 