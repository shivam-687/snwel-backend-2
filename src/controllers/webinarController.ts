import { Request, Response } from 'express';
import {Webinar} from '@/models/WebinarModel'
// Import webinar service functions
import { createWebinar, getWebinarById, updateWebinarById, deleteWebinarById, addHosts, getAllWebinars, getWebinarBySlug } from '@/service/webinarService';
import { errorResponseFromError, successResponse } from '@/utils/helpers/appResponse';
import { catchAsync } from '@/utils/helpers/catchAsync';
import { extractListOptions } from '@/utils/helpers';

// Controller function to create a new webinar
export async function createWebinarController(req: Request, res: Response): Promise<void> {
  try {
    const webinarData = req.body; // Assuming webinar data is sent in the request body
    const newWebinar = await createWebinar(webinarData);
    successResponse(newWebinar, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to get a webinar by ID
export async function getWebinarByIdController(req: Request, res: Response): Promise<void> {
  try {
    const webinarId = req.params.id;
    const webinar = await getWebinarById(webinarId);
    if (!webinar) {
      res.status(404).json({ message: 'Webinar not found' });
      return;
    }
    successResponse(webinar, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}
export async function getWebinarBySlugController(req: Request, res: Response): Promise<void> {
  try {
    const webinarSlug = req.params.slug;
    const webinar = await getWebinarBySlug(webinarSlug);
    if (!webinar) {
      res.status(404).json({ message: 'Webinar not found' });
      return;
    }
    successResponse(webinar, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to update a webinar by ID
export async function updateWebinarByIdController(req: Request, res: Response): Promise<void> {
  try {
    const webinarId = req.params.id;
    const updateData = req.body;
    const updatedWebinar = await updateWebinarById(webinarId, updateData);
    if (!updatedWebinar) {
      res.status(404).json({ message: 'Webinar not found' });
      return;
    }
    successResponse(updatedWebinar, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to delete a webinar by ID
export async function deleteWebinarByIdController(req: Request, res: Response): Promise<void> {
  try {
    const webinarId = req.params.id;
    await deleteWebinarById(webinarId);
    successResponse({ message: 'Hosts deleted successfully' }, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to add hosts to a webinar
export async function addHostsToWebinarController(req: Request, res: Response): Promise<void> {
  try {
    const webinarId = req.params.id;
    const { hosts } = req.body;
    await addHosts(webinarId, hosts);
    successResponse({ message: 'Hosts added successfully' }, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

export const getAllWebinarController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const courses = await getAllWebinars(extractListOptions(req));
  return successResponse(courses, res, { message: "Webinars Fetched successfully!" })
});
