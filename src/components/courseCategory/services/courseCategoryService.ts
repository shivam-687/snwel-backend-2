import { CourseCategoryModel, CourseCategory } from '@/models/CourseCategory';
import { ListOptions, PaginatedList } from '@/types/custom';
import { convertToPagination, getPaginationParams } from '@/utils/helpers';
import { ObjectId } from 'mongodb';

// Function to create a new course category
const createCourseCategory = async (categoryData: CourseCategory): Promise<CourseCategory> => {
    try {
        const newCategory = new CourseCategoryModel(categoryData);
        return await newCategory.save();
    } catch (error: any) {
        throw new Error(`Error creating course category: ${error.message}`);
    }
};

// Function to retrieve all course categories
const getAllCourseCategories =  async (options: ListOptions): Promise<PaginatedList<CourseCategory>> => {
    try {
        const { limit = 10, page = 1, filter } = options;
        const query: any = {}; 
        const paginationData = getPaginationParams(limit, page)
        if (filter && filter.search) {
          const searchRegex = new RegExp(filter.search, 'i');
          query.$or = [{ name: searchRegex }, { email: searchRegex }];
        }
      
        const skip = (page - 1) * limit;
        const categoryListWithCounts = await CourseCategoryModel.aggregate([
            {
                $lookup: {
                    from: 'courses',
                    localField: '_id',
                    foreignField: 'categories',
                    as: 'courses'
                }
            },
            {
                $lookup: {
                    from: 'coursecategories',
                    localField: 'parentCategory',
                    foreignField: '_id',
                    as: 'parentCategory'
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    shortDescription: 1,
                    isPremium: 1,
                    isActive: 1,
                    slug: 1,
                    courseCount: { $size: '$courses' },
                    parentCategory: { $arrayElemAt: ['$parentCategory', 0] }
                }
            },
            {
                $skip: skip
            },
            {
                $limit: Number(limit)
            }
        ]);
        const count = await CourseCategoryModel.countDocuments(query);
        return convertToPagination(categoryListWithCounts, count, paginationData.limit, paginationData.offset);
    } catch (error: any) {
        throw new Error(`Error retrieving course categories: ${error.message}`);
    }
};

// Function to retrieve a course category by ID
const getCourseCategoryById = async (categoryId: string): Promise<CourseCategory | null> => {
    try {
        return await CourseCategoryModel.findById(categoryId).exec();
    } catch (error: any) {
        throw new Error(`Error retrieving course category: ${error.message}`);
    }
};

// Function to update a course category by ID
const updateCourseCategoryById = async (categoryId: string, updateData: Partial<CourseCategory>): Promise<CourseCategory | null> => {
    try {
        return await CourseCategoryModel.findByIdAndUpdate(categoryId, updateData, { new: true }).exec();
    } catch (error: any) {
        throw new Error(`Error updating course category: ${error.message}`);
    }
};

// Function to delete a course category by ID
const deleteCourseCategoryById = async (categoryId: string): Promise<void> => {
    try {
        await CourseCategoryModel.findByIdAndDelete(categoryId).exec();
    } catch (error: any) {
        throw new Error(`Error: 500:Error deleting course category: ${error.message}`);
    }
};

export async function attachParentCategory(targetCategoryId: string, parentCategoryId?: string) {
    try {
      // Find the target category by ID
      const targetCategory = await CourseCategoryModel.findOne({_id: new ObjectId(targetCategoryId)});
      if (!targetCategory) {
        throw new Error('Error: 404:Target category not found');
      }
  
      // Update the parent category ID
      targetCategory.parentCategory = parentCategoryId ?  new ObjectId(parentCategoryId) : undefined;
      await targetCategory.save();
      const updatedCategory = await targetCategory.populate('parentCategory');
        return updatedCategory;
    // return {}
    } catch (error: any) {
      throw new Error(`Error: 500:Failed to attach parent category: ${error.message}`);
    }
  }

export { createCourseCategory, getAllCourseCategories, getCourseCategoryById, updateCourseCategoryById, deleteCourseCategoryById };
