// src/controllers/enquiryController.ts

import { Request, Response } from 'express';
import { 
  createEnquiry, 
  getEnquiryById, 
  updateEnquiryById, 
  deleteEnquiryById, 
  getAllEnquiries, 
  exportEnquiries
} from '@/service/snwelEnquiryService';
import { errorResponseFromError, successResponse } from '@/utils/helpers/appResponse';
import { catchAsync } from '@/utils/helpers/catchAsync';

// Controller function to create a new enquiry
export async function createEnquiryController(req: Request, res: Response): Promise<void> {
  try {
    const enquiryData = req.body; // Assuming enquiry data is sent in the request body
    const newEnquiry = await createEnquiry(enquiryData);
    successResponse(newEnquiry, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to get an enquiry by ID
export async function getEnquiryByIdController(req: Request, res: Response): Promise<void> {
  try {
    const enquiryId = req.params.id;
    const enquiry = await getEnquiryById(enquiryId);
    if (!enquiry) {
      res.status(404).json({ message: 'Enquiry not found' });
      return;
    }
    successResponse(enquiry, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to update an enquiry by ID
export async function updateEnquiryByIdController(req: Request, res: Response): Promise<void> {
  try {
    const enquiryId = req.params.id;
    const updateData = req.body;
    const updatedEnquiry = await updateEnquiryById(enquiryId, updateData);
    if (!updatedEnquiry) {
      res.status(404).json({ message: 'Enquiry not found' });
      return;
    }
    successResponse(updatedEnquiry, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to delete an enquiry by ID
export async function deleteEnquiryByIdController(req: Request, res: Response): Promise<void> {
  try {
    const enquiryId = req.params.id;
    await deleteEnquiryById(enquiryId);
    successResponse({ message: 'Enquiry deleted successfully' }, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to get all enquiries with pagination
export const getAllEnquiriesController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const options = req.query;
  const enquiries = await getAllEnquiries(options);
  return successResponse(enquiries, res, { message: "Enquiries fetched successfully!" });
});

// Controller function to export enquiries to CSV
export const exportEnquiriesController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const options = req.query;
  const csvData = await exportEnquiries(options);
  res.header('Content-Type', 'text/csv');
  res.attachment(`enquiries_${options.page}.csv`);
  res.send(csvData);
});
