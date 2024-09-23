"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partialUpdateCourse = exports.getCourseBySlug = exports.deleteCourseById = exports.updateCourseById = exports.getCourseById = exports.getAllCourses = exports.createCourse = void 0;
const CourseModel_1 = require("../models/CourseModel");
const helpers_1 = require("../utils/helpers");
const mongodb_1 = require("mongodb");
const CourseCategory_1 = require("../models/CourseCategory");
const mongoose_1 = require("mongoose");
// Function to create a new course
const createCourse = async (courseData) => {
    try {
        const curData = courseData.curriculum.map(cr => ({ ...cr, curriculumType: cr.curriculumType ? new mongodb_1.ObjectId(cr.curriculumType) : undefined }));
        const newCourse = new CourseModel_1.CourseModel({ ...courseData, curriculum: curData });
        return await newCourse.save();
    }
    catch (error) {
        throw new Error(`Error: creating course: ${error.message}`);
    }
};
exports.createCourse = createCourse;
// Function to retrieve all courses
const getAllCourses = async (options, adminMode = false) => {
    try {
        const { limit = 10, page = 1, filter, search } = options;
        const query = {};
        const paginationData = (0, helpers_1.getPaginationParams)(limit, page);
        if (!adminMode) {
            query.status = CourseModel_1.COURSE_STATUS.PUBLISHED;
        }
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
        if (filter && Object.keys(filter).some((value) => ['qualifications', 'trainingModes'].includes(value))) {
            Object.entries(filter).forEach(([key, value]) => {
                query[key] = {
                    $in: [value]
                };
            });
        }
        const skip = (page - 1) * limit;
        const users = await CourseModel_1.CourseModel
            .find(query)
            .skip(skip)
            .limit(limit)
            .populate('instructors')
            .populate('categories')
            .populate('qualifications', '_id name code')
            .populate('trainingModes', '_id name code')
            .populate('curriculum.curriculumType', 'name');
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
        const query = mongoose_1.Types.ObjectId.isValid(courseId)
            ? { _id: courseId }
            : { slug: courseId };
        return await CourseModel_1.CourseModel.findById(query).populate(['instructors', 'categories', 'curriculum.curriculumType']);
    }
    catch (error) {
        throw new Error(`Error: retrieving course: ${error.message}`);
    }
};
exports.getCourseById = getCourseById;
const getCourseBySlug = async (slug, admin = false) => {
    try {
        const query = mongoose_1.Types.ObjectId.isValid(slug)
            ? { _id: slug }
            : { slug: slug };
        if (admin) {
            query.status = CourseModel_1.COURSE_STATUS.PUBLISHED;
        }
        const cs = await CourseModel_1.CourseModel
            .findOne(query)
            .populate(['instructors', 'categories', 'curriculum.curriculumType', 'qualifications', 'trainingModes']);
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
        if (updateData.curriculum) {
            updateData.curriculum = updateData?.curriculum?.map(cr => ({ ...cr, curriculumType: cr.curriculumType ? new mongodb_1.ObjectId(cr.curriculumType) : undefined }));
        }
        await CourseModel_1.CourseModel.findByIdAndUpdate(courseId, updateData, { new: true }).exec();
        return CourseModel_1.CourseModel.findOne({ _id: new mongodb_1.ObjectId(courseId) });
    }
    catch (error) {
        throw new Error(`Error: updating course: ${error.message}`);
    }
};
exports.updateCourseById = updateCourseById;
const partialUpdateCourse = async (courseId, updateData) => {
    try {
        await CourseModel_1.CourseModel.findByIdAndUpdate(courseId, updateData, { new: true }).exec();
        return CourseModel_1.CourseModel.findOne({ _id: new mongodb_1.ObjectId(courseId) });
    }
    catch (error) {
        throw new Error(`Error: updating course: ${error.message}`);
    }
};
exports.partialUpdateCourse = partialUpdateCourse;
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
