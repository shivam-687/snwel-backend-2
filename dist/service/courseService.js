"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourseById = exports.updateCourseById = exports.getCourseById = exports.getAllCourses = exports.createCourse = void 0;
const CourseModel_1 = require("@/models/CourseModel");
// Function to create a new course
const createCourse = async (courseData) => {
    try {
        const newCourse = new CourseModel_1.CourseModel(courseData);
        return await newCourse.save();
    }
    catch (error) {
        throw new Error(`Error creating course: ${error.message}`);
    }
};
exports.createCourse = createCourse;
// Function to retrieve all courses
const getAllCourses = async () => {
    try {
        return await CourseModel_1.CourseModel.find().exec();
    }
    catch (error) {
        throw new Error(`Error retrieving courses: ${error.message}`);
    }
};
exports.getAllCourses = getAllCourses;
// Function to retrieve a course by ID
const getCourseById = async (courseId) => {
    try {
        return await CourseModel_1.CourseModel.findById(courseId).exec();
    }
    catch (error) {
        throw new Error(`Error retrieving course: ${error.message}`);
    }
};
exports.getCourseById = getCourseById;
// Function to update a course by ID
const updateCourseById = async (courseId, updateData) => {
    try {
        return await CourseModel_1.CourseModel.findByIdAndUpdate(courseId, updateData, { new: true }).exec();
    }
    catch (error) {
        throw new Error(`Error updating course: ${error.message}`);
    }
};
exports.updateCourseById = updateCourseById;
// Function to delete a course by ID
const deleteCourseById = async (courseId) => {
    try {
        await CourseModel_1.CourseModel.findByIdAndDelete(courseId).exec();
    }
    catch (error) {
        throw new Error(`Error deleting course: ${error.message}`);
    }
};
exports.deleteCourseById = deleteCourseById;
