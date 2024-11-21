import { FilterQuery, PaginateOptions } from 'mongoose';
import { CourseCategoryModel, ICourseCategory } from '../models/CourseCategory';
import { createSlug } from '@/utils/helpers';

export class CategoryService {
  static async createCategory(categoryData: Partial<ICourseCategory>): Promise<ICourseCategory> {
    try {
      const slug = createSlug(categoryData.name!);
      
      const category = new CourseCategoryModel({
        ...categoryData,
        slug
      });

      return await category.save();
    } catch (error) {
      throw error;
    }
  }

  static async updateCategory(
    categoryId: string, 
    categoryData: Partial<ICourseCategory>
  ): Promise<ICourseCategory | null> {
    try {
      if (categoryData.name) {
        categoryData.slug = createSlug(categoryData.name);
      }

      return await CourseCategoryModel.findByIdAndUpdate(
        categoryId,
        categoryData,
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  static async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      const result = await CourseCategoryModel.findByIdAndDelete(categoryId);
      return !!result;
    } catch (error) {
      throw error;
    }
  }

  static async getCategories(
    query: FilterQuery<ICourseCategory> = {},
    options: PaginateOptions = { page: 1, limit: 10 }
  ) {
    try {
      return await CourseCategoryModel.paginate(query, {
        ...options,
        populate: 'parentCategory'
      });
    } catch (error) {
      throw error;
    }
  }

  static async getCategoryById(categoryId: string): Promise<ICourseCategory | null> {
    try {
      return await CourseCategoryModel.findById(categoryId)
        .populate('parentCategory');
    } catch (error) {
      throw error;
    }
  }

  static async getActiveCategories() {
    try {
      return await CourseCategoryModel.find({ isActive: true })
        .sort({ order: 1 })
        .populate('parentCategory');
    } catch (error) {
      throw error;
    }
  }
} 