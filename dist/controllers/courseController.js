"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseByIdController = exports.createCourseCategoryController = exports.getAllCourseCategoriesController = exports.createCourseController = exports.getAllCoursesController = void 0;
const courseService_1 = require("@/service/courseService");
const CourseCategory_1 = require("@/models/CourseCategory");
const appResponse_1 = require("@/utils/helpers/appResponse");
// Function to get all courses
const getAllCoursesController = async (req, res) => {
    try {
        const courses = await (0, courseService_1.getAllCourses)();
        return (0, appResponse_1.successResponse)(courses, res, { message: "Course Fetched successfully!" });
    }
    catch (error) {
        res.status(500).json({ message: `Error getting courses: ${error.message}` });
    }
};
exports.getAllCoursesController = getAllCoursesController;
// Function to create a new course
const createCourseController = async (req, res) => {
    try {
        const courseData = req.body;
        const newCourse = await (0, courseService_1.createCourse)(courseData);
        res.status(201).json(newCourse);
    }
    catch (error) {
        res.status(500).json({ message: `Error creating course: ${error.message}` });
    }
};
exports.createCourseController = createCourseController;
// Function to get course by id
const getCourseByIdController = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!courseId) {
            return appResponse_1.courseErrorResponse.notFound(null, res);
        }
        const categories = await CourseCategory_1.CourseCategoryModel.find().exec();
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: `Error getting course categories: ${error.message}` });
    }
};
exports.getCourseByIdController = getCourseByIdController;
// Function to get all course categories
const getAllCourseCategoriesController = async (req, res) => {
    try {
        const categories = await CourseCategory_1.CourseCategoryModel.find().exec();
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: `Error getting course categories: ${error.message}` });
    }
};
exports.getAllCourseCategoriesController = getAllCourseCategoriesController;
// Function to create a new course category
const createCourseCategoryController = async (req, res) => {
    try {
        const categoryData = req.body;
        const newCategory = await CourseCategory_1.CourseCategoryModel.create(categoryData);
        res.status(201).json(newCategory);
    }
    catch (error) {
        res.status(500).json({ message: `Error creating course category: ${error.message}` });
    }
};
exports.createCourseCategoryController = createCourseCategoryController;
