// src/components/testimonial/admin-testimonial-service.ts

import TestimonialModel, { ITestimonial } from './testimonial-model';
import { ListOptions } from '@/types/custom';
import { convertSortOrder } from '@/utils/helpers';

// Function to create a new testimonial
export async function adminCreateTestimonial(data: Partial<ITestimonial>): Promise<ITestimonial> {
    try {
        // If the testimonial should be published immediately, set the publishedAt
        if (data.published && !data.publishedAt) {
            data.publishedAt = new Date();
        }
        const testimonial = await TestimonialModel.create(data);
        return testimonial.toObject();
    } catch (error: any) {
        console.error(`Failed to create testimonial: ${error.message}`, error);
        throw new Error(`Failed to create testimonial: ${error.message}`);
    }
}

// Function to get a testimonial by ID (Admins can retrieve both published and unpublished)
export async function adminGetTestimonialById(testimonialId: string): Promise<ITestimonial | null> {
    try {
        const testimonial = await TestimonialModel.findById(testimonialId);
        return testimonial ? testimonial.toObject() : null;
    } catch (error: any) {
        throw new Error(`Failed to get testimonial: ${error.message}`);
    }
}

// Function to update a testimonial by ID
export async function adminUpdateTestimonial(testimonialId: string, updateData: Partial<ITestimonial>): Promise<ITestimonial | null> {
    try {
        // Set publishedAt when publishing
        if (updateData.published && !updateData.publishedAt) {
            updateData.publishedAt = new Date();
        }
        const testimonial = await TestimonialModel.findByIdAndUpdate(testimonialId, updateData, { new: true });
        return testimonial ? testimonial.toObject() : null;
    } catch (error: any) {
        throw new Error(`Failed to update testimonial: ${error.message}`);
    }
}

// Function to soft delete a testimonial by ID
export async function adminDeleteTestimonial(testimonialId: string): Promise<void> {
    try {
        await TestimonialModel.delete({ _id: testimonialId });
    } catch (error: any) {
        throw new Error(`Failed to delete testimonial: ${error.message}`);
    }
}

// Function to get all testimonials with pagination (Admins can view all)
export const adminGetAllTestimonials = async (options: ListOptions): Promise<any> => {
    try {
        const { limit = 10, page = 1, search, filter, sort, startDate, endDate } = options;
        const query: any = {};

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

        // Apply filter based on the status
        switch (filter?.statusFilter) {
            case 'published':
                query.published = true;
                break;
            case 'draft':
                query.published = false;
                break;
            case 'all':
            default:
                // Show both published and draft testimonials
                query.published = { $in: [true, false] };
                break;
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
