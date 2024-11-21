"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseBySlugController = exports.getCourseByIdController = exports.getAllCoursesController = void 0;
const courseService_1 = require("../../../components/course/service/courseService");
const appResponse_1 = require("../../../utils/helpers/appResponse");
const catchAsync_1 = require("../../../utils/helpers/catchAsync");
const helpers_1 = require("../../../utils/helpers");
const getAllCoursesController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const courses = await (0, courseService_1.getAllCourses)((0, helpers_1.extractListOptions)(req));
    return (0, appResponse_1.successResponse)(courses, res, { message: "Course Fetched successfully!" });
});
exports.getAllCoursesController = getAllCoursesController;
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
