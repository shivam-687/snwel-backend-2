// src/services/adminBlogCategoryService.ts

import BlogCategoryModel, { IBlogCategory as BlogCategory } from './blog-category-model';
import { ListOptions } from '@/types/custom';
import { convertSortOrder, getPaginationParams } from '@/utils/helpers';
import { Types } from 'mongoose';
import { Parser } from 'json2csv';

// Function to create a new blog category
export async function adminCreateBlogCategory(data: BlogCategory): Promise<BlogCategory> {
    try {
        const category = await BlogCategoryModel.create(data);
        return category.toObject();
    } catch (error: any) {
        console.error(`Failed to create blog category: ${error.message}`, error);
        throw new Error(`Failed to create blog category: ${error.message}`);
    }
}

// Function to get a blog category by ID or slug
export async function adminGetBlogCategoryById(categoryId: string): Promise<BlogCategory | null> {
    try {
        const query = Types.ObjectId.isValid(categoryId)
            ? { _id: categoryId }
            : { slug: categoryId };
        const category = await BlogCategoryModel.findOne(query);
        return category ? category.toObject() : null;
    } catch (error: any) {
        throw new Error(`Failed to get blog category: ${error.message}`);
    }
}

// Function to update a blog category by ID
export async function adminUpdateBlogCategoryById(categoryId: string, updateData: Partial<BlogCategory>): Promise<BlogCategory | null> {
    try {
        const category = await BlogCategoryModel.findByIdAndUpdate(categoryId, updateData, { new: true });
        return category ? category.toObject() : null;
    } catch (error: any) {
        throw new Error(`Failed to update blog category: ${error.message}`);
    }
}

// Function to soft delete a blog category by ID
export async function softDeleteBlogCategoryById(categoryId: string): Promise<void> {
    try {
        await BlogCategoryModel.delete({ _id: categoryId });
        console.log(`Soft deleted blog category with ID: ${categoryId}`);
    } catch (error: any) {
        throw new Error(`Failed to soft delete blog category: ${error.message}`);
    }
}

// Function to delete a blog category by ID
export async function adminDeleteBlogCategoryById(categoryId: string): Promise<void> {
    try {
        await BlogCategoryModel.delete({ _id: categoryId });
    } catch (error: any) {
        throw new Error(`Failed to delete blog category: ${error.message}`);
    }
}

// Function to get all blog categories with pagination
export const adminGetAllBlogCategories = async (options: ListOptions): Promise<any> => {
    try {
        const { limit = 10, page = 1, search, sort } = options;
        const query: any = {};

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ name: searchRegex }, { description: searchRegex }];
        }

        const categories = await BlogCategoryModel.paginate(
            query,
            {
                page,
                limit,
                sort: sort ? convertSortOrder(sort) : { createdAt: -1 },
            }
        );

        return categories;
    } catch (error: any) {
        throw new Error(`Error retrieving blog categories: ${error.message}`);
    }
};

// Function to export blog categories to CSV
export const adminExportBlogCategories = async (options: ListOptions): Promise<string> => {
    try {
        const categories = await adminGetAllBlogCategories(options);
        const categoryData = categories.docs; // Extract the documents from the paginated result

        // Convert the data to CSV format
        const parser = new Parser();
        const csv = parser.parse(categoryData);

        return csv; // You can return the CSV string or save it to a file
    } catch (error: any) {
        throw new Error(`Error exporting blog categories: ${error.message}`);
    }
};

// Function to hard delete all soft-deleted blog categories
export const hardDeleteSoftDeletedBlogCategories = async (): Promise<void> => {
    try {
        // Find and remove all soft-deleted blog categories
        await BlogCategoryModel.deleteMany({ deleted: true });
        console.log("Successfully hard deleted all soft-deleted blog categories");
    } catch (error: any) {
        throw new Error(`Failed to hard delete soft-deleted blog categories: ${error.message}`);
    }
};
