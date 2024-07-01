import { Request, Response } from 'express';
import {
  createJobVacancy,
  getAllJobVacancies,
  getJobVacancy,
  updateJobVacancyById,
  deleteJobVacancyById,
} from '@/service/jobVacancyService';
import { successResponse, errorResponse } from '@/utils/helpers/appResponse';
import { catchAsync } from '@/utils/helpers/catchAsync';
import { extractListOptions } from '@/utils/helpers';

const createJobVacancyController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const jobData = req.body;

  const newJobVacancy = await createJobVacancy(jobData);
  successResponse(newJobVacancy, res, { message: 'Job vacancy created successfully!' });
});

const getAllJobVacanciesController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const options = { ...req.query };
  const jobVacancies = await getAllJobVacancies(extractListOptions(req));
  successResponse(jobVacancies, res, { message: 'Job vacancies fetched successfully!' });
});

const getJobVacancyController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { idOrSlug } = req.params;
  const jobVacancy = await getJobVacancy(idOrSlug);
  if (!jobVacancy) {
    return errorResponse('Job vacancy not found', res);
  }
  successResponse(jobVacancy, res, { message: 'Job vacancy fetched successfully!' });
});

const updateJobVacancyByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;
  const updatedJobVacancy = await updateJobVacancyById(id, updateData);
  if (!updatedJobVacancy) {
    return errorResponse('Job vacancy not found', res);
  }
  successResponse(updatedJobVacancy, res, { message: 'Job vacancy updated successfully!' });
});

const deleteJobVacancyByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await deleteJobVacancyById(id);
  successResponse(null, res, { message: 'Job vacancy deleted successfully!' });
});

export {
  createJobVacancyController,
  getAllJobVacanciesController,
  getJobVacancyController,
  updateJobVacancyByIdController,
  deleteJobVacancyByIdController,
};
