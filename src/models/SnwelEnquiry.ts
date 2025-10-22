// src/models/Enquiry.ts

import { paginateOptions } from '@/config/common';
import mongoose, { Schema, model, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoosePaginate.paginate.options = paginateOptions;

export interface ISnwelEnquiry extends Document {
  name: string;
  businessEmail: string;
  company: string;
  enquiryType: 'General Enquiry' | 'Analysis Services' | '3D Modelling' | '3D Laser Scanning' | 'Piping Engineering' | 'Structural Engineering' | 'Instrumentation Engineering' | '3D Printing' | 'Fire Fighting Engineering';
  mobileNo: string;
  description: string;
  consentGiven: boolean;
  otpValidated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const enquirySchema = new Schema<ISnwelEnquiry>({
  name: { type: String, required: true },
  businessEmail: { type: String, required: true },
  company: { type: String, required: true },
  enquiryType: { 
    type: String,
    required: true 
  },
  mobileNo: { type: String, required: true },
  description: { type: String, required: true, maxlength: 200 },
  consentGiven: { type: Boolean, required: true, default: false },
  otpValidated: { type: Boolean, required: true, default: false },
}, { timestamps: true });

// Indexes for optimized queries
enquirySchema.index({ createdAt: -1 }); // Listing and sorting enquiries
enquirySchema.index({ enquiryType: 1, createdAt: -1 }); // Filter by type with date
enquirySchema.index({ businessEmail: 1 }); // Email lookup
enquirySchema.index({ otpValidated: 1 }); // Filter by validation status

enquirySchema.plugin(mongoosePaginate);

const SnwelEnquiry = model<ISnwelEnquiry, mongoose.PaginateModel<ISnwelEnquiry>>('SnwelEnquiry', enquirySchema);

export default SnwelEnquiry;
