"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourseCategoryById = exports.updateCourseCategoryById = exports.getCourseCategoryById = exports.getAllCourseCategories = exports.createCourseCategory = exports.attachParentCategory = void 0;
const CourseCategory_1 = require("../models/CourseCategory");
const helpers_1 = require("../utils/helpers");
const mongodb_1 = require("mongodb");
const createCourseCategory = async (categoryData) => {
    try {
        const newCategory = new CourseCategory_1.CourseCategoryModel(categoryData);
        return await newCategory.save();
    }
    catch (error) {
        throw new Error(`Error creating course category: ${error.message}`);
    }
};
exports.createCourseCategory = createCourseCategory;
const getAllCourseCategories = async (options) => {
    try {
        const { limit = 10, page = 1, filter } = options;
        const query = {};
        const paginationData = (0, helpers_1.getPaginationParams)(limit, page);
        if (filter && filter.search) {
            const searchRegex = new RegExp(filter.search, 'i');
            query.$or = [{ name: searchRegex }, { email: searchRegex }];
        }
        const skip = (page - 1) * limit;
        const categoryListWithCounts = await CourseCategory_1.CourseCategoryModel.aggregate([
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
        const count = await CourseCategory_1.CourseCategoryModel.countDocuments(query);
        return (0, helpers_1.convertToPagination)(categoryListWithCounts, count, paginationData.limit, paginationData.offset);
    }
    catch (error) {
        throw new Error(`Error retrieving course categories: ${error.message}`);
    }
};
exports.getAllCourseCategories = getAllCourseCategories;
const getCourseCategoryById = async (categoryId) => {
    try {
        return await CourseCategory_1.CourseCategoryModel.findById(categoryId).exec();
    }
    catch (error) {
        throw new Error(`Error retrieving course category: ${error.message}`);
    }
};
exports.getCourseCategoryById = getCourseCategoryById;
const updateCourseCategoryById = async (categoryId, updateData) => {
    try {
        return await CourseCategory_1.CourseCategoryModel.findByIdAndUpdate(categoryId, updateData, { new: true }).exec();
    }
    catch (error) {
        throw new Error(`Error updating course category: ${error.message}`);
    }
};
exports.updateCourseCategoryById = updateCourseCategoryById;
const deleteCourseCategoryById = async (categoryId) => {
    try {
        await CourseCategory_1.CourseCategoryModel.findByIdAndDelete(categoryId).exec();
    }
    catch (error) {
        throw new Error(`Error: 500:Error deleting course category: ${error.message}`);
    }
};
exports.deleteCourseCategoryById = deleteCourseCategoryById;
async function attachParentCategory(targetCategoryId, parentCategoryId) {
    try {
        const targetCategory = await CourseCategory_1.CourseCategoryModel.findOne({ _id: new mongodb_1.ObjectId(targetCategoryId) });
        if (!targetCategory) {
            throw new Error('Error: 404:Target category not found');
        }
        targetCategory.parentCategory = parentCategoryId ? new mongodb_1.ObjectId(parentCategoryId) : undefined;
        await targetCategory.save();
        const updatedCategory = await targetCategory.populate('parentCategory');
        return updatedCategory;
    }
    catch (error) {
        throw new Error(`Error: 500:Failed to attach parent category: ${error.message}`);
    }
}
exports.attachParentCategory = attachParentCategory;
