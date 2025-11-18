import JobVacancyModel, { JobVacancy } from '@/models/JobVacancy';
import { PaginatedList, ListOptions } from '@/types/custom';
import { convertToPagination, getPaginationParams } from '@/utils/helpers';
import mongoose from 'mongoose';

const createJobVacancy = async (jobData: Partial<JobVacancy>): Promise<JobVacancy> => {
  try {
    const newJobVacancy = new JobVacancyModel(jobData);
    return await newJobVacancy.save();
  } catch (error: any) {
    throw new Error(`Error: creating job vacancy: ${error.message}`);
  }
};

const getAllJobVacancies = async (options: ListOptions): Promise<PaginatedList<JobVacancy>> => {
  try {
    const { limit = 10, page = 1, search, filter } = options;
    const query: any = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ title: searchRegex }, { companyName: searchRegex }];
    }

    if(filter && filter['location']){
      const searchRegex = new RegExp(filter['location'], 'i');
      query.$or = [{ "location.city": searchRegex }, { "location.country": searchRegex }, {"location.state": searchRegex}];
    }

    if (filter && filter['type']) {
      query.employmentType = filter['type'];
    }

    const skip = (page - 1) * limit;

    const jobVacancies = await JobVacancyModel.find(query)
    .populate('categories', 'name')
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await JobVacancyModel.countDocuments(query);

    const paginationData = getPaginationParams(limit, page);
    return convertToPagination(jobVacancies, count, paginationData.limit, paginationData.offset);
  } catch (error: any) {
    throw new Error(`Error: retrieving job vacancies: ${error.message}`);
  }
};

const getJobVacancyById = async (jobId: string): Promise<JobVacancy | null> => {
  try {
    return await JobVacancyModel.findById(jobId).populate('categories', 'name');;
  } catch (error: any) {
    throw new Error(`Error: retrieving job vacancy: ${error.message}`);
  }
};

const updateJobVacancyById = async (jobId: string, updateData: Partial<JobVacancy>): Promise<JobVacancy | null> => {
  try {
    return await JobVacancyModel.findByIdAndUpdate(jobId, updateData, { new: true }).populate('categories', 'name');;
  } catch (error: any) {
    throw new Error(`Error: updating job vacancy: ${error.message}`);
  }
};

const getJobVacancy = async (identifier: string): Promise<JobVacancy | null> => {
    try {
      // Check if the identifier is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(identifier)) {
        return await JobVacancyModel.findById(identifier).populate('categories', 'name');;
      } else {
        // Otherwise, assume it's a slug and find by slug
        return await JobVacancyModel.findOne({ slug: identifier }).populate('categories', 'name');;
      }
    } catch (error: any) {
      throw new Error(`Error retrieving job vacancy: ${error.message}`);
    }
  };

const deleteJobVacancyById = async (jobId: string): Promise<void> => {
  try {
    await JobVacancyModel.findByIdAndDelete(jobId);
  } catch (error: any) {
    throw new Error(`Error: deleting job vacancy: ${error.message}`);
  }
};

export {
  createJobVacancy,
  getAllJobVacancies,
  getJobVacancyById,
  updateJobVacancyById,
  deleteJobVacancyById,
  getJobVacancy
};
