"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourseCategoryById = exports.updateCourseCategoryById = exports.getCourseCategoryById = exports.getAllCourseCategories = exports.createCourseCategory = void 0;
const CourseCategory_1 = require("@/models/CourseCategory");
// Function to create a new course category
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
// Function to retrieve all course categories
const getAllCourseCategories = async () => {
    try {
        return await CourseCategory_1.CourseCategoryModel.find().exec();
    }
    catch (error) {
        throw new Error(`Error retrieving course categories: ${error.message}`);
    }
};
exports.getAllCourseCategories = getAllCourseCategories;
// Function to retrieve a course category by ID
const getCourseCategoryById = async (categoryId) => {
    try {
        return await CourseCategory_1.CourseCategoryModel.findById(categoryId).exec();
    }
    catch (error) {
        throw new Error(`Error retrieving course category: ${error.message}`);
    }
};
exports.getCourseCategoryById = getCourseCategoryById;
// Function to update a course category by ID
const updateCourseCategoryById = async (categoryId, updateData) => {
    try {
        return await CourseCategory_1.CourseCategoryModel.findByIdAndUpdate(categoryId, updateData, { new: true }).exec();
    }
    catch (error) {
        throw new Error(`Error updating course category: ${error.message}`);
    }
};
exports.updateCourseCategoryById = updateCourseCategoryById;
// Function to delete a course category by ID
const deleteCourseCategoryById = async (categoryId) => {
    try {
        await CourseCategory_1.CourseCategoryModel.findByIdAndDelete(categoryId).exec();
    }
    catch (error) {
        throw new Error(`Error deleting course category: ${error.message}`);
    }
};
exports.deleteCourseCategoryById = deleteCourseCategoryById;
