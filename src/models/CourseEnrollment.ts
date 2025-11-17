import mongoose, { Document, Schema, Types } from 'mongoose';
import { paginateOptions } from '@/config/common';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoosePaginate.paginate.options = paginateOptions;


export interface EnrollmentPerson {
    name?: string;
    email: string;
    phone?: string;
    location?: any;
}

export interface CourseEnrollment extends Document {
    userId?: Types.ObjectId; // Optional legacy reference to the user who requested the enrollment
    courseId: Types.ObjectId; // Reference to the course for which enrollment is requested
    status: 'ACTIVE' | 'PENDING' | 'DECLINED'; // Enrollment status
    paymentStatus: 'PAID' | 'PENDING' | 'FAILED'; // Payment status
    paymentMethod: string; // Payment method
    expiredAt: Date; // Expiration date
    createdAt: Date; // Timestamp provided by Mongoose
    updatedAt: Date; // Timestamp provided by Mongoose
    otp?: {
        otp: string;
        expirationTime: Date;
        verified: boolean;
    },
    applicant?: EnrollmentPerson;
    extra: any,
    qualification: Types.ObjectId;
    mode: Types.ObjectId,
    occupation: Types.ObjectId,
    widget?: Types.ObjectId
}

const EnrollmentPersonSchema = new Schema<EnrollmentPerson>({
    name: { type: String },
    email: { type: String, required: true },
    phone: { type: String, default: null },
    location: { type: Schema.Types.Mixed, default: null }
}, { _id: false });

const CourseEnrollmentSchema = new Schema<CourseEnrollment>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    status: { type: String, enum: ['ACTIVE', 'PENDING', 'DECLINED'], default: 'PENDING' },
    paymentStatus: { type: String, enum: ['PAID', 'PENDING', 'FAILED'], default: 'PENDING' },
    paymentMethod: { type: String, enum: ['CASH', 'EXTERNAL', 'INAPP'] },
    expiredAt: { type: Date },
    otp: {
        otp: String,
        expirationTime: Date,
        verified: { type: Boolean, default: false },
    },
    applicant: { type: EnrollmentPersonSchema, required: false },
    extra: {type: Schema.Types.Mixed, default: {}},
    qualification: {type: Schema.Types.ObjectId,  ref: 'Master', required: true},
    mode: {type: Schema.Types.ObjectId,  ref: 'Master', required: true},
    occupation:{type:  Schema.Types.ObjectId,  ref: 'Master', required: true},
    widget: {type: Schema.Types.ObjectId, ref: 'Widget', default: null}
}, { timestamps: true }); // This option enables Mongoose to add createdAt and updatedAt timestamps automatically

// Indexes for optimized queries
CourseEnrollmentSchema.index({ status: 1, createdAt: -1 }); // Dashboard stats, enrollment filtering
CourseEnrollmentSchema.index({ status: 1, updatedAt: -1 }); // Revenue queries with updatedAt
CourseEnrollmentSchema.index({ courseId: 1, createdAt: -1 }); // Top performing courses
CourseEnrollmentSchema.index({ userId: 1, createdAt: -1 }); // User enrollments
CourseEnrollmentSchema.index({ paymentStatus: 1, createdAt: -1 }); // Revenue calculations
CourseEnrollmentSchema.index({ paymentStatus: 1, updatedAt: -1 }); // Yearly sales data
CourseEnrollmentSchema.index({ createdAt: -1 }); // Recent enrollments sorting
CourseEnrollmentSchema.index({ courseId: 1, 'applicant.email': 1, 'applicant.phone': 1 });

CourseEnrollmentSchema.plugin(mongoosePaginate);
const CourseEnrollmentModel = mongoose.model<CourseEnrollment,  mongoose.PaginateModel<CourseEnrollment>>('CourseEnrollment', CourseEnrollmentSchema);

export default CourseEnrollmentModel;

