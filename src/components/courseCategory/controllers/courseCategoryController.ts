import { Request, Response } from 'express';
import { getAllCourseCategories, createCourseCategory, getCourseCategoryById, updateCourseCategoryById, deleteCourseCategoryById, attachParentCategory } from '../services/courseCategoryService';
import { errorResponse, errorResponseFromError, successResponse } from '@/utils/helpers/appResponse';
import { logger } from '@/utils/logger';

// Controller function to get all course categories
const getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const courseCategories = await getAllCourseCategories({...req.query});
        successResponse(courseCategories, res);
    } catch (error: any) {
        errorResponseFromError(error, res)
    }
};

// Controller function to create a course category
const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const newCategory = await createCourseCategory(req.body);
        successResponse(newCategory, res)
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Controller function to get a course category by ID
const getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const categoryId = req.params.id;
        const category = await getCourseCategoryById(categoryId);
        if (!category) {
            errorResponse(null, res, {status: 404, message: "Category not found!"})
            return;
        }
        successResponse(category, res)
    } catch (error: any) {
        errorResponseFromError(error, res)
    }
};

// Controller function to update a course category by ID
const updateCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const categoryId = req.params.id;
        const updatedCategory = await updateCourseCategoryById(categoryId, req.body);
        if (!updatedCategory) {
            errorResponse(null, res, {status: 404, message: "Category not found!"})
            return;
        }
        successResponse(updatedCategory, res, {message: "Categopry updated successfully"})
    } catch (error: any) {
        errorResponseFromError(error, res)
    
    }
};

// Controller function to delete a course category by ID
const deleteCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const categoryId = req.params.id;
        await deleteCourseCategoryById(categoryId);
        successResponse({id: categoryId}, res, {message: "Category deleted successfully"})
    } catch (error: any) {
        errorResponseFromError(error, res)
    }
};

export async function attachParent(req: Request, res: Response): Promise<void> {
    const { targetCategoryId, parentCategoryId } = req.body;
  
    try {
    const updated =  await attachParentCategory(targetCategoryId, parentCategoryId);
      successResponse(updated, res, { message: 'Parent category attached successfully' });
    } catch (error) {
        logger.error(error)
      errorResponseFromError(error, res);
    }
  }

export { getAllCategories, createCategory, getCategoryById, updateCategoryById, deleteCategoryById, attachParentCategory };
