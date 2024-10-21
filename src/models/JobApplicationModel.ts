// src/models/JobApplication.ts

import mongoose, { Schema, model, Document } from 'mongoose';
import { paginateOptions } from '@/config/common';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoosePaginate.paginate.options = paginateOptions;

export interface IJobApplication extends Document {
  jobId: Schema.Types.ObjectId;
  applicantName: string;
  email: string;
  phone?: string,
  resumeUrl?: string;
  coverLetter?: string;
  status: 'applied' | 'interview' | 'offered' | 'rejected';
  appliedDate: Date;
  notes?: string;
  createdAt: Date,
  updatedAt: Date
}

const jobApplicationSchema = new Schema<IJobApplication>({
  jobId: { type: Schema.Types.ObjectId, required: true, ref: 'JobVacancy' },
  applicantName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  resumeUrl: { type: String, required: true },
  coverLetter: { type: String },
  status: { type: String, enum: ['applied', 'interview', 'offered', 'rejected'], default: 'applied' },
  appliedDate: { type: Date, default: Date.now },
  notes: { type: String },
}, {timestamps: true});

jobApplicationSchema.plugin(mongoosePaginate);

const JobApplication = model<IJobApplication, mongoose.PaginateModel<IJobApplication>>('JobApplication', jobApplicationSchema);

export default JobApplication;

