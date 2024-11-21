"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCourseController = void 0;
const courseService_1 = require("../services/courseService");
const categoryService_1 = require("../services/categoryService");
const enrollmentService_1 = require("../services/enrollmentService");
const catchAsync_1 = require("../../../utils/helpers/catchAsync");
const appResponse_1 = require("../../../utils/helpers/appResponse");
const helpers_1 = require("../../../utils/helpers");
class AdminCourseController {
}
exports.AdminCourseController = AdminCourseController;
_a = AdminCourseController;
AdminCourseController.createCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const courseData = req.body;
    const userId = req.user._id;
    const course = await courseService_1.CourseService.createCourse(courseData, userId);
    return (0, appResponse_1.successResponse)(course, res, { message: 'Course created successfully' });
});
AdminCourseController.getAllCourses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const options = (0, helpers_1.extractListOptions)(req);
    const courses = await courseService_1.CourseService.getCourses({}, options);
    return (0, appResponse_1.successResponse)(courses, res, { message: 'Courses fetched successfully' });
});
AdminCourseController.getCourseById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const course = await courseService_1.CourseService.getCourseById(id);
    if (!course) {
        return (0, appResponse_1.errorResponse)('Course not found', res);
    }
    return (0, appResponse_1.successResponse)(course, res, { message: 'Course fetched successfully' });
});
AdminCourseController.updateCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user._id;
    const course = await courseService_1.CourseService.updateCourse(id, updateData, userId);
    if (!course) {
        return (0, appResponse_1.errorResponse)('Course not found', res);
    }
    return (0, appResponse_1.successResponse)(course, res, { message: 'Course updated successfully' });
});
AdminCourseController.deleteCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await courseService_1.CourseService.deleteCourse(id);
    return (0, appResponse_1.successResponse)(null, res, { message: 'Course deleted successfully' });
});
AdminCourseController.publishCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { publish } = req.body;
    const course = await courseService_1.CourseService.publishCourse(id, publish);
    if (!course) {
        return (0, appResponse_1.errorResponse)('Course not found', res);
    }
    return (0, appResponse_1.successResponse)(course, res, {
        message: `Course ${publish ? 'published' : 'unpublished'} successfully`
    });
});
AdminCourseController.createCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const categoryData = req.body;
    const category = await categoryService_1.CategoryService.createCategory(categoryData);
    return (0, appResponse_1.successResponse)(category, res, { message: 'Category created successfully' });
});
AdminCourseController.getAllCategories = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const options = (0, helpers_1.extractListOptions)(req);
    const categories = await categoryService_1.CategoryService.getCategories(options);
    return (0, appResponse_1.successResponse)(categories, res, { message: 'Categories fetched successfully' });
});
AdminCourseController.updateCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const category = await categoryService_1.CategoryService.updateCategory(id, updateData);
    if (!category) {
        return (0, appResponse_1.errorResponse)('Category not found', res);
    }
    return (0, appResponse_1.successResponse)(category, res, { message: 'Category updated successfully' });
});
AdminCourseController.deleteCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await categoryService_1.CategoryService.deleteCategory(id);
    return (0, appResponse_1.successResponse)(null, res, { message: 'Category deleted successfully' });
});
AdminCourseController.getAllEnrollments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const options = (0, helpers_1.extractListOptions)(req);
    const enrollments = await enrollmentService_1.EnrollmentService.getEnrollments(options);
    return (0, appResponse_1.successResponse)(enrollments, res, { message: 'Enrollments fetched successfully' });
});
AdminCourseController.updateEnrollmentStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const enrollment = await enrollmentService_1.EnrollmentService.updateEnrollmentStatus(id, status);
    if (!enrollment) {
        return (0, appResponse_1.errorResponse)('Enrollment not found', res);
    }
    return (0, appResponse_1.successResponse)(enrollment, res, { message: 'Enrollment status updated successfully' });
});
