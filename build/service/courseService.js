"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseBySlug = exports.deleteCourseById = exports.updateCourseById = exports.getCourseById = exports.getAllCourses = exports.createCourse = void 0;
const CourseModel_1 = require("../models/CourseModel");
const helpers_1 = require("../utils/helpers");
const mongodb_1 = require("mongodb");
const CourseCategory_1 = require("../models/CourseCategory");
// Function to create a new course
const createCourse = async (courseData) => {
    try {
        const newCourse = new CourseModel_1.CourseModel(courseData);
        return await newCourse.save();
    }
    catch (error) {
        throw new Error(`Error: creating course: ${error.message}`);
    }
};
exports.createCourse = createCourse;
// Function to retrieve all courses
const getAllCourses = async (options) => {
    try {
        const { limit = 10, page = 1, filter, search } = options;
        const query = {};
        const paginationData = (0, helpers_1.getPaginationParams)(limit, page);
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ name: searchRegex }, { email: searchRegex }];
        }
        if (filter && filter.categoryIds && filter.categoryIds.length > 0) {
            query['categories'] = {
                $in: filter.categoryIds.map((ctg) => new mongodb_1.ObjectId(ctg))
            };
        }
        if (filter && filter.category) {
            const ctg = await CourseCategory_1.CourseCategoryModel.findOne({ slug: filter.category });
            query['categories'] = {
                $in: new mongodb_1.ObjectId(ctg?._id)
            };
        }
        if (filter && filter?.isPremium) {
            query["isPremium"] = true;
        }
        if (filter && filter?.isPopular) {
            query["isPopular"] = true;
        }
        const skip = (page - 1) * limit;
        const users = await CourseModel_1.CourseModel.find(query).skip(skip).limit(limit).populate(['instructors', 'categories']);
        const count = await CourseModel_1.CourseModel.countDocuments(query);
        return (0, helpers_1.convertToPagination)(users, count, paginationData.limit, paginationData.offset);
    }
    catch (error) {
        throw new Error(`Error: retrieving courses: ${error.message}`);
    }
};
exports.getAllCourses = getAllCourses;
// Function to retrieve a course by ID
const getCourseById = async (courseId) => {
    try {
        return await CourseModel_1.CourseModel.findById(courseId).populate(['instructors', 'categories']);
    }
    catch (error) {
        throw new Error(`Error: retrieving course: ${error.message}`);
    }
};
exports.getCourseById = getCourseById;
const getCourseBySlug = async (slug) => {
    try {
        const cs = await CourseModel_1.CourseModel.findOne({ slug }).populate(['instructors', 'categories']);
        console.log({ cs, slug });
        return cs;
    }
    catch (error) {
        throw new Error(`Error: retrieving course: ${error.message}`);
    }
};
exports.getCourseBySlug = getCourseBySlug;
// Function to update a course by ID
const updateCourseById = async (courseId, updateData) => {
    try {
        await CourseModel_1.CourseModel.findByIdAndUpdate(courseId, updateData, { new: true }).exec();
        if (updateData.curriculum) {
            const course = await CourseModel_1.CourseModel.findOne({ _id: new mongodb_1.ObjectId(courseId) });
            if (!course) {
                throw new Error('Course not found');
            }
            course.curriculum = updateData.curriculum;
            await course.save();
        }
        return CourseModel_1.CourseModel.findOne({ _id: new mongodb_1.ObjectId(courseId) });
    }
    catch (error) {
        throw new Error(`Error: updating course: ${error.message}`);
    }
};
exports.updateCourseById = updateCourseById;
// Function to delete a course by ID
const deleteCourseById = async (courseId) => {
    try {
        await CourseModel_1.CourseModel.findByIdAndDelete(courseId).exec();
    }
    catch (error) {
        throw new Error(`Error: deleting course: ${error.message}`);
    }
};
exports.deleteCourseById = deleteCourseById;
