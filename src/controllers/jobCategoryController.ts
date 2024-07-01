import { Request, Response } from 'express';
import {
  createJobCategory,
  getAllJobCategories,
  getJobCategoryById,
  updateJobCategoryById,
  deleteJobCategoryById,
} from '@/service/jobCategoryService';
import { successResponse, errorResponse } from '@/utils/helpers/appResponse';
import { catchAsync } from '@/utils/helpers/catchAsync';
import { extractListOptions } from '@/utils/helpers';

const createJobCategoryController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const categoryData = req.body;

  const newJobCategory = await createJobCategory(categoryData);
  successResponse(newJobCategory, res, { message: 'Job category created successfully!' });
});

const getAllJobCategoriesController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const options = { ...req.query };
  
  const jobCategories = await getAllJobCategories(extractListOptions(req));
  successResponse(jobCategories, res, { message: 'Job categories fetched successfully!' });
});

const getJobCategoryByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const jobCategory = await getJobCategoryById(id);
  if (!jobCategory) {
    return errorResponse('Job category not found', res);
  }
  successResponse(jobCategory, res, { message: 'Job category fetched successfully!' });
});

const updateJobCategoryByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;
  const updatedJobCategory = await updateJobCategoryById(id, updateData);
  if (!updatedJobCategory) {
    return errorResponse('Job category not found', res);
  }
  successResponse(updatedJobCategory, res, { message: 'Job category updated successfully!' });
});

const deleteJobCategoryByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await deleteJobCategoryById(id);
  successResponse(null, res, { message: 'Job category deleted successfully!' });
});

export {
  createJobCategoryController,
  getAllJobCategoriesController,
  getJobCategoryByIdController,
  updateJobCategoryByIdController,
  deleteJobCategoryByIdController,
};
