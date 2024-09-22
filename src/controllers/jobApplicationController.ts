import { Request, Response } from 'express';
import { 
  createJobApplication, 
  getJobApplicationById, 
  updateJobApplicationById, 
  deleteJobApplicationById, 
  getAllJobApplications, 
  exportJobApplications
} from '@/service/JobApplication';
import { errorResponseFromError, successResponse } from '@/utils/helpers/appResponse';
import { catchAsync } from '@/utils/helpers/catchAsync';

// Controller function to create a new job application
export async function createJobApplicationController(req: Request, res: Response): Promise<void> {
  try {
    const jobApplicationData = req.body; // Assuming job application data is sent in the request body
    const newJobApplication = await createJobApplication(jobApplicationData);
    successResponse(newJobApplication, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to get a job application by ID
export async function getJobApplicationByIdController(req: Request, res: Response): Promise<void> {
  try {
    const jobApplicationId = req.params.id;
    const jobApplication = await getJobApplicationById(jobApplicationId);
    if (!jobApplication) {
      res.status(404).json({ message: 'Job Application not found' });
      return;
    }
    successResponse(jobApplication, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to update a job application by ID
export async function updateJobApplicationByIdController(req: Request, res: Response): Promise<void> {
  try {
    const jobApplicationId = req.params.id;
    const updateData = req.body;
    const updatedJobApplication = await updateJobApplicationById(jobApplicationId, updateData);
    if (!updatedJobApplication) {
      res.status(404).json({ message: 'Job Application not found' });
      return;
    }
    successResponse(updatedJobApplication, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to delete a job application by ID
export async function deleteJobApplicationByIdController(req: Request, res: Response): Promise<void> {
  try {
    const jobApplicationId = req.params.id;
    await deleteJobApplicationById(jobApplicationId);
    successResponse({ message: 'Job Application deleted successfully' }, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to get all job applications with pagination
export const getAllJobApplicationsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const options = req.query;
  const jobApplications = await getAllJobApplications(options);
  return successResponse(jobApplications, res, { message: "Job Applications fetched successfully!" });
});


export const exportJobApplicationsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const options = req.query;
  const csvData = await exportJobApplications(options);
  res.header('Content-Type', 'text/csv');
  res.attachment(`job_applications_${options.page}.csv`);
  res.send(csvData);
});
