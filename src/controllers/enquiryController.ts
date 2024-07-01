// controllers/enquiryController.ts
import { Request, Response } from 'express';
import {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiryById,
  deleteEnquiryById,
  getEnquiryByEmailAndType
} from '@/service/enquiryService';
import { successResponse, errorResponse } from '@/utils/helpers/appResponse';
import { catchAsync } from '@/utils/helpers/catchAsync';
import { extractListOptions } from '@/utils/helpers';

const createEnquiryController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const enquiryData = req.body;

  if(enquiryData?.isUnique) {
    const exists = await getEnquiryByEmailAndType(enquiryData.email, enquiryData.type);
    if(exists) throw new Error("Error: 400:Your Enquiry already exists!!");
  }
  const newEnquiry = await createEnquiry(enquiryData);
  successResponse(newEnquiry, res, { message: 'Enquiry created successfully!' });
});

const getAllEnquiriesController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const options = { ...req.query };
  const enquiries = await getAllEnquiries(extractListOptions(req));
  successResponse(enquiries, res, { message: 'Enquiries fetched successfully!' });
});

const getEnquiryByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const enquiry = await getEnquiryById(id);
  if (!enquiry) {
    return errorResponse('Enquiry not found', res);
  }
  successResponse(enquiry, res, { message: 'Enquiry fetched successfully!' });
});

const updateEnquiryByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;
  const updatedEnquiry = await updateEnquiryById(id, updateData);
  if (!updatedEnquiry) {
    return errorResponse('Enquiry not found', res);
  }
  successResponse(updatedEnquiry, res, { message: 'Enquiry updated successfully!' });
});

const deleteEnquiryByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await deleteEnquiryById(id);
  successResponse(null, res, { message: 'Enquiry deleted successfully!' });
});

export {
  createEnquiryController,
  getAllEnquiriesController,
  getEnquiryByIdController,
  updateEnquiryByIdController,
  deleteEnquiryByIdController
};
