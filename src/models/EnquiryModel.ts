// models/Enquiry.ts
import mongoose, { Schema, Document } from 'mongoose';

import { paginateOptions } from '@/config/common';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoosePaginate.paginate.options = paginateOptions;


export interface Enquiry extends Document {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  type: string;
  extraInfo?: any;
  priority?: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String },
    type: { type: String, enum: ['general', 'job', 'support', 'webinar', 'contact'], required: true },
    extraInfo: { type: Schema.Types.Mixed },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  },
  { timestamps: true }
);

EnquirySchema.plugin(mongoosePaginate);

export default mongoose.model<Enquiry, mongoose.PaginateModel<Enquiry>>('Enquiry', EnquirySchema);
