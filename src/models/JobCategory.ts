import mongoose, { Document, Schema } from 'mongoose';
import { paginateOptions } from '@/config/common';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoosePaginate.paginate.options = paginateOptions;

export interface IJobCategory {
    _id: string;
    name: string;
    description?: string;
  }

// Define the TypeScript interface for the job category
export interface JobCategory {
  name: string;
  description?: string;
}

// Extend the JobCategory interface to include Mongoose Document properties
interface JobCategoryDocument extends JobCategory, Document {}

const jobCategorySchema: Schema<JobCategoryDocument> = new Schema({
  name: { type: String, required: true },
  description: { type: String },
});

jobCategorySchema.plugin(mongoosePaginate);

const JobCategoryModel = mongoose.model<JobCategoryDocument, mongoose.PaginateModel<JobCategoryDocument>>('JobCategory', jobCategorySchema);

export default JobCategoryModel;
