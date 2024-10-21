import mongoose, { Document, Schema } from 'mongoose';
import { JobCategory } from './JobCategory';
import slugify from 'slugify';
import { paginateOptions } from '@/config/common';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoosePaginate.paginate.options = paginateOptions;

export interface Location {
    country: string;
    state: string;
    city: string;
    address: string;
    zipcode: string;
  }
  
  export interface JobVacancy {
    title: string;
    slug: string;
    companyName: string;
    description: string;
    requirements: string;
    location: Location;
    salaryRange: string;
    employmentType: 'full-time' | 'part-time' | 'contract' | 'temporary';
    applicationDeadline: Date;
    categories: JobCategory[];
    postedDate: Date;
    contactInfo: string;
    experienceLevel: 'entry-level' | 'mid-level' | 'senior-level';
    companyLogo?: string;
    additionalInfo?: string;
    status: 'open' | 'closed' | 'filled';
    remoteWorkOption?: boolean;
    benefits?: string;
    applicationLink?: string;
    isFeatured: boolean;
    isActive: boolean
  }
  interface JobVacancyDocument extends JobVacancy, Document {}

const locationSchema: Schema = new Schema({
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  zipcode: { type: String, required: true },
});

const jobVacancySchema: Schema<JobVacancyDocument> = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  companyName: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  location: { type: locationSchema },
  salaryRange: { type: String },
  employmentType: { type: String, required: true, enum: ['full-time', 'part-time', 'contract', 'temporary'] },
  applicationDeadline: { type: Date, required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: 'JobCategory' }],
  postedDate: { type: Date, default: Date.now },
  contactInfo: { type: String },
  experienceLevel: { type: String, required: true, enum: ['entry-level', 'mid-level', 'senior-level'] },
  companyLogo: { type: String },
  additionalInfo: { type: String },
  status: { type: String, default: 'open', enum: ['open', 'closed', 'filled'] },
  remoteWorkOption: { type: Boolean, default: false },
  benefits: { type: String },
  applicationLink: { type: String },
  isFeatured: {type: Boolean, default: false},
  isActive: {type: Boolean, default: false}
});

jobVacancySchema.pre<JobVacancy>('save', async function (next) {
    const job = this;
  
    // Check if title field is modified or job is new
    // if (true) {
      let baseSlug = slugify(job.title, { lower: true, strict: true });
      let uniqueSlug = baseSlug;
      let counter = 1;
  
      // Check for existing slugs
      while (await mongoose.models.JobVacancy.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${counter++}`;
      }
  
      job.slug = uniqueSlug;
    // }
  
    next();
  });


  jobVacancySchema.plugin(mongoosePaginate);

const JobVacancyModel = mongoose.model<JobVacancyDocument, mongoose.PaginateModel<JobVacancy>>('JobVacancy', jobVacancySchema);

export default JobVacancyModel;