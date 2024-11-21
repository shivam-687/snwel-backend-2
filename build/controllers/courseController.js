"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partialUpdateCourseController = exports.deleteCourseController = exports.updateCourseController = exports.getCourseBySlugController = exports.getCourseByIdController = exports.createCourseController = exports.getAllCoursesController = void 0;
const courseService_1 = require("../service/courseService");
const appResponse_1 = require("../utils/helpers/appResponse");
const catchAsync_1 = require("../utils/helpers/catchAsync");
const helpers_1 = require("../utils/helpers");
const getAllCoursesController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const courses = await (0, courseService_1.getAllCourses)((0, helpers_1.extractListOptions)(req));
    return (0, appResponse_1.successResponse)(courses, res, { message: "Course Fetched successfully!" });
});
exports.getAllCoursesController = getAllCoursesController;
const createCourseController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const courseData = req.body;
    const alreadyExists = await (0, courseService_1.getCourseBySlug)(courseData.slug);
    if (alreadyExists) {
        return (0, appResponse_1.errorResponse)(null, res, { message: "Course already exists!", status: 400 });
    }
    const newCourse = await (0, courseService_1.createCourse)(courseData);
    (0, appResponse_1.successResponse)(newCourse, res);
});
exports.createCourseController = createCourseController;
const getCourseByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { courseId } = req.params;
    if (!courseId) {
        return appResponse_1.courseErrorResponse.notFound(null, res);
    }
    const course = await (0, courseService_1.getCourseById)(courseId);
    (0, appResponse_1.successResponse)(course, res);
});
exports.getCourseByIdController = getCourseByIdController;
const getCourseBySlugController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { slug } = req.params;
    if (!slug) {
        return appResponse_1.courseErrorResponse.notFound(null, res);
    }
    const course = await (0, courseService_1.getCourseBySlug)(slug);
    (0, appResponse_1.successResponse)(course, res);
});
exports.getCourseBySlugController = getCourseBySlugController;
const updateCourseController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { courseId } = req.params;
    if (!courseId) {
        return appResponse_1.courseErrorResponse.notFound(null, res);
    }
    const course = await (0, courseService_1.updateCourseById)(courseId, req.body);
    (0, appResponse_1.successResponse)(course, res, { message: "Course Updated successfully!" });
});
exports.updateCourseController = updateCourseController;
const partialUpdateCourseController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { courseId } = req.params;
    if (!courseId) {
        return appResponse_1.courseErrorResponse.notFound(null, res);
    }
    const course = await (0, courseService_1.partialUpdateCourse)(courseId, req.body);
    (0, appResponse_1.successResponse)(course, res, { message: "Course Updated successfully!" });
});
exports.partialUpdateCourseController = partialUpdateCourseController;
const deleteCourseController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { courseId } = req.params;
    if (!courseId) {
        return appResponse_1.courseErrorResponse.notFound(null, res);
    }
    await (0, courseService_1.deleteCourseById)(courseId);
    (0, appResponse_1.successResponse)(null, res, { message: "Course deleted successfully!" });
});
exports.deleteCourseController = deleteCourseController;
