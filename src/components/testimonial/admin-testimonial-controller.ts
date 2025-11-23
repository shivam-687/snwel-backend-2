// src/components/testimonial/admin-testimonial-controller.ts

import { Request, Response } from 'express';
import {
    adminCreateTestimonial,
    adminGetAllTestimonials,
    adminGetTestimonialById,
    adminUpdateTestimonial,
    adminDeleteTestimonial,
} from './admin-testimonial-service';
import { successResponse, errorResponseFromError } from '@/utils/helpers/appResponse';
import { catchAsync } from '@/utils/helpers/catchAsync';

// Controller function to create a new testimonial
export async function createTestimonialController(req: Request, res: Response): Promise<void> {
    try {
        const testimonialData = req.body;
        const newTestimonial = await adminCreateTestimonial(testimonialData);
        successResponse(newTestimonial, res, { message: 'Testimonial created successfully!' });
    } catch (error) {
        errorResponseFromError(error, res);
    }
}

// Controller function to get a testimonial by ID
export async function getTestimonialByIdController(req: Request, res: Response): Promise<void> {
    try {
        const testimonialId = req.params.id;
        const testimonial = await adminGetTestimonialById(testimonialId);
        if (!testimonial) {
            res.status(404).json({ message: 'Testimonial not found' });
            return;
        }
        successResponse(testimonial, res);
    } catch (error) {
        errorResponseFromError(error, res);
    }
}

// Controller function to update a testimonial by ID
export async function updateTestimonialController(req: Request, res: Response): Promise<void> {
    try {
        const testimonialId = req.params.id;
        const updateData = req.body;
        const updatedTestimonial = await adminUpdateTestimonial(testimonialId, updateData);
        if (!updatedTestimonial) {
            res.status(404).json({ message: 'Testimonial not found' });
            return;
        }
        successResponse(updatedTestimonial, res, { message: 'Testimonial updated successfully!' });
    } catch (error) {
        errorResponseFromError(error, res);
    }
}

// Controller function to soft delete a testimonial by ID
export async function deleteTestimonialController(req: Request, res: Response): Promise<void> {
    try {
        const testimonialId = req.params.id;
        await adminDeleteTestimonial(testimonialId);
        successResponse({ message: 'Testimonial deleted successfully' }, res);
    } catch (error) {
        errorResponseFromError(error, res);
    }
}

// Controller function to get all testimonials with pagination
export const getAllTestimonialsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const options = req.query;
    const testimonials = await adminGetAllTestimonials(options);
    return successResponse(testimonials, res, { message: 'Testimonials fetched successfully!' });
});
