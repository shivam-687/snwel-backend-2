// src/services/adminBlogService.ts

import BlogModel, { IBlog as Blog } from './blog-model';
import { ListOptions } from '@/types/custom';
import { convertSortOrder, getPaginationParams } from '@/utils/helpers';
import { Types } from 'mongoose';
import { Parser } from 'json2csv';

// Function to create a new blog (Admins may have access to create published blogs directly)
export async function adminCreateBlog(data: Blog): Promise<Blog> {
    try {
        // If the blog should be published immediately, set the `publishedAt`
        if (data.published && !data.publishedAt) {
            data.publishedAt = new Date();
        }
        const blog = await BlogModel.create(data);
        return blog.toObject();
    } catch (error: any) {
        console.error(`Failed to create blog: ${error.message}`, error);
        throw new Error(`Failed to create blog: ${error.message}`);
    }
}

// Function to get a blog by ID (Admins can retrieve both published and unpublished blogs)
export async function adminGetBlogById(blogId: string): Promise<Blog | null> {
    try {
        const query = Types.ObjectId.isValid(blogId)
            ? { _id: blogId }
            : { slug: blogId };
        const blog = await BlogModel.findOne(query).populate( 'author', '_id profilePic name email');
        return blog ? blog.toObject() : null;
    } catch (error: any) {
        throw new Error(`Failed to get blog: ${error.message}`);
    }
}

// Function to update a blog by ID (Admins can update everything, including publication status)
export async function adminUpdateBlogById(blogId: string, updateData: Partial<Blog>): Promise<Blog | null> {
    try {
        if (updateData.published && !updateData.publishedAt) {
            updateData.publishedAt = new Date();
        }
        const blog = await BlogModel.findByIdAndUpdate(blogId, updateData, { new: true });
        return blog ? blog.toObject() : null;
    } catch (error: any) {
        throw new Error(`Failed to update blog: ${error.message}`);
    }
}

// Function to delete a blog by ID (Admins can delete blogs regardless of the published status)
export async function adminDeleteBlogById(blogId: string): Promise<void> {
    try {
        await BlogModel.delete({ _id: blogId });
    } catch (error: any) {
        throw new Error(`Failed to delete blog: ${error.message}`);
    }
}

// Function to get all blogs with pagination (Admins can view all blogs including unpublished)
// Function to get all blogs with pagination (Admins can view blogs based on predefined filter keywords)
export const adminGetAllBlogs = async (options: ListOptions): Promise<any> => {
    try {
        const { limit = 10, page = 1, search, filter, sort, startDate, endDate } = options;
        const query: any = {};

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ title: searchRegex }, { content: searchRegex }, { author: searchRegex }];
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

        // Apply filter based on the 'show' keyword
        switch (filter?.statusFilter) {
            case 'published':
                query.published = true;
                break;
            case 'unpublished':
                query.published = false;
                break;
            case 'all':
                query.published = { $in: [true, false] }; // Shows both published and unpublished blogs
                break;
            default:
                // No filter for 'undefined', returning only published blogs by default
                query.published = { $in: [true, false] };
                break;
        }

        const blogs = await BlogModel.paginate(
            query,
            {
                populate: 'category',
                page,
                limit,
                sort: sort ? convertSortOrder(sort) : { createdAt: -1 },
            }
        );

        return blogs;
    } catch (error: any) {
        throw new Error(`Error retrieving blogs: ${error.message}`);
    }
};


// Function to export blogs to CSV (Admins can export all blogs including unpublished)
export const adminExportBlogs = async (options: ListOptions): Promise<string> => {
    try {
        const blogs = await adminGetAllBlogs(options);
        const blogData = blogs.docs; // Extract the documents from the paginated result

        // Convert the data to CSV format
        const parser = new Parser();
        const csv = parser.parse(blogData);

        return csv; // You can return the CSV string or save it to a file
    } catch (error: any) {
        throw new Error(`Error exporting blogs: ${error.message}`);
    }
};


export const hardDeleteSoftDeletedBlogs = async (): Promise<void> => {
    try {
        // Find and remove all soft-deleted blogs
        await BlogModel.deleteMany({ deleted: true });
        console.log("Successfully hard deleted all soft-deleted blogs");
    } catch (error: any) {
        throw new Error(`Failed to hard delete soft-deleted blogs: ${error.message}`);
    }
};

// Function to soft delete a blog by ID
export const softDeleteBlogById = async (blogId: string): Promise<void> => {
    try {
        await BlogModel.delete({ _id: blogId });
        console.log(`Soft deleted blog with ID: ${blogId}`);
    } catch (error: any) {
        throw new Error(`Failed to soft delete blog: ${error.message}`);
    }
};
