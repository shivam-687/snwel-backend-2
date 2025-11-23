// src/components/testimonial/client-testimonial-service.ts

import TestimonialModel, { ITestimonial } from './testimonial-model';
import { ListOptions } from '@/types/custom';
import { convertSortOrder } from '@/utils/helpers';

// Function to get a published testimonial by ID
export async function getTestimonialById(testimonialId: string): Promise<ITestimonial | null> {
    try {
        const testimonial = await TestimonialModel.findOne({
            _id: testimonialId,
            published: true // Enforce published status
        }).lean();
        return testimonial;
    } catch (error: any) {
        throw error;
    }
}

// Function to get all published testimonials with pagination
export const getPublishedTestimonials = async (options: ListOptions): Promise<any> => {
    try {
        const { limit = 10, page = 1, search, sort, startDate, endDate } = options;
        const query: any = {
            published: true // Enforce published status
        };

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ name: searchRegex }, { content: searchRegex }, { company: searchRegex }];
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        const testimonials = await TestimonialModel.paginate(
            query,
            {
                page,
                limit,
                sort: sort ? convertSortOrder(sort) : { createdAt: -1 },
            }
        );

        return testimonials;
    } catch (error: any) {
        throw new Error(`Error retrieving testimonials: ${error.message}`);
    }
};
