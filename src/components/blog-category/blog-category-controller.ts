import { Request, Response } from 'express';
import {
    adminCreateBlogCategory,
    adminGetBlogCategoryById,
    adminUpdateBlogCategoryById,
    adminDeleteBlogCategoryById,
    adminGetAllBlogCategories,
    hardDeleteSoftDeletedBlogCategories,
} from './blog-category-service';
import { successResponse, errorResponseFromError } from '@/utils/helpers/appResponse';
import { catchAsync } from '@/utils/helpers/catchAsync';
import { Types } from 'mongoose';


// Controller function to create a new blog category
export const createBlogCategoryController = catchAsync(async (req: Request, res: Response): Promise<any> => {
    const categoryData = req.body; // Assuming blog category data is sent in the request body
    const newCategory = await adminCreateBlogCategory(categoryData);
    successResponse(newCategory, res, { message: "Blog category created successfully!" });
});

// Controller function to get a blog category by ID or slug
export const getBlogCategoryByIdController = catchAsync(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    // Validate the ID or slug
    if (!id || !Types.ObjectId.isValid(id) && typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid category ID or slug.' });
    }

    const category = await adminGetBlogCategoryById(id);
    if (!category) {
        return res.status(404).json({ message: 'Blog category not found' });
    }
    successResponse(category, res);
});

// Controller function to update a blog category by ID
export const updateBlogCategoryByIdController = catchAsync(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const updateData = req.body;

    // Validate the ID
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid category ID.' });
    }

    const updatedCategory = await adminUpdateBlogCategoryById(id, updateData);
    if (!updatedCategory) {
        return res.status(404).json({ message: 'Blog category not found' });
    }
    successResponse(updatedCategory, res, { message: "Blog category updated successfully!" });
});

// Controller function to soft delete a blog category by ID
export const deleteBlogCategoryByIdController = catchAsync(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    // Validate the ID
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid category ID.' });
    }

    await adminDeleteBlogCategoryById(id);
    successResponse({ message: 'Blog category deleted successfully' }, res);
});

// Controller function to get all blog categories with pagination
export const getAllBlogCategoriesController = catchAsync(async (req: Request, res: Response): Promise<any> => {
    const options = req.query; // Assuming options are passed as query params
    const categories = await adminGetAllBlogCategories(options);
    successResponse(categories, res, { message: "Blog categories fetched successfully!" });
});

// Controller function to hard delete all soft-deleted blog categories
export const hardDeleteAllSoftDeletedBlogCategoriesController = catchAsync(async (req: Request, res: Response): Promise<any> => {
    await hardDeleteSoftDeletedBlogCategories();
    successResponse({ message: "All soft-deleted blog categories have been permanently deleted!" }, res);
});
