// src/components/testimonial/client-testimonial-controller.ts

import { Request, Response } from 'express';
import {
    getTestimonialById,
    getPublishedTestimonials
} from './client-testimonial-service';
import { successResponse, errorResponseFromError } from '@/utils/helpers/appResponse';
import { catchAsync } from '@/utils/helpers/catchAsync';

// Controller function to get a published testimonial by ID
export async function getTestimonialByIdController(req: Request, res: Response): Promise<void> {
    try {
        const testimonialId = req.params.id;
        const testimonial = await getTestimonialById(testimonialId);
        if (!testimonial) {
            res.status(404).json({ message: 'Testimonial not found' });
            return;
        }
        successResponse(testimonial, res);
    } catch (error) {
        errorResponseFromError(error, res);
    }
}

// Controller function to get all published testimonials with pagination
export const getPublishedTestimonialsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const options = req.query;
    const testimonials = await getPublishedTestimonials(options);
    return successResponse(testimonials, res, { message: 'Testimonials fetched successfully!' });
});
