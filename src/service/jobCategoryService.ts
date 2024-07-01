import JobCategoryModel, { JobCategory } from '@/models/JobCategory';
import { ListOptions, PaginatedList } from '@/types/custom';
import { convertToPagination, getPaginationParams } from '@/utils/helpers';
import mongoose from 'mongoose';

const createJobCategory = async (categoryData: Partial<JobCategory>): Promise<JobCategory> => {
  try {
    const newJobCategory = new JobCategoryModel(categoryData);
    return await newJobCategory.save();
  } catch (error: any) {
    throw new Error(`Error: creating job category: ${error.message}`);
  }
};

const getAllJobCategories = async (options: ListOptions): Promise<PaginatedList<JobCategory>> => {
  try {
    const { limit = 10, page = 1, search } = options;
    const query: any = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ name: searchRegex }];
    }

    const skip = (page - 1) * limit;

    const jobVacancies = await JobCategoryModel.find(query)
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await JobCategoryModel.countDocuments(query);

    const paginationData = getPaginationParams(limit, page);
    return convertToPagination(jobVacancies, count, paginationData.limit, paginationData.offset);
  } catch (error: any) {
    throw new Error(`Error: retrieving job categories: ${error.message}`);
  }
};

const getJobCategoryById = async (categoryId: string): Promise<JobCategory | null> => {
  try {
    return await JobCategoryModel.findById(categoryId);
  } catch (error: any) {
    throw new Error(`Error: retrieving job category: ${error.message}`);
  }
};

const updateJobCategoryById = async (categoryId: string, updateData: Partial<JobCategory>): Promise<JobCategory | null> => {
  try {
    return await JobCategoryModel.findByIdAndUpdate(categoryId, updateData, { new: true });
  } catch (error: any) {
    throw new Error(`Error: updating job category: ${error.message}`);
  }
};

const deleteJobCategoryById = async (categoryId: string): Promise<void> => {
  try {
    await JobCategoryModel.findByIdAndDelete(categoryId);
  } catch (error: any) {
    throw new Error(`Error: deleting job category: ${error.message}`);
  }
};

export {
  createJobCategory,
  getAllJobCategories,
  getJobCategoryById,
  updateJobCategoryById,
  deleteJobCategoryById,
};
