import mongoose, { Document, Schema, Types } from 'mongoose';


export interface CourseEnrollment extends Document {
    userId: Types.ObjectId; // Reference to the user who requested the enrollment
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
    extra: any,
    qualification: Types.ObjectId;
    mode: Types.ObjectId,
    occupation: Types.ObjectId,
    widget?: Types.ObjectId
}

const CourseEnrollmentSchema = new Schema<CourseEnrollment>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
    extra: {type: Schema.Types.Mixed, default: {}},
    qualification: {type: Schema.Types.ObjectId,  ref: 'Master', required: true},
    mode: {type: Schema.Types.ObjectId,  ref: 'Master', required: true},
    occupation:{type:  Schema.Types.ObjectId,  ref: 'Master', required: true},
    widget: {type: Schema.Types.ObjectId, ref: 'Widget', default: null}
}, { timestamps: true }); // This option enables Mongoose to add createdAt and updatedAt timestamps automatically

const CourseEnrollmentModel = mongoose.model<CourseEnrollment>('CourseEnrollment', CourseEnrollmentSchema);

export default CourseEnrollmentModel;

