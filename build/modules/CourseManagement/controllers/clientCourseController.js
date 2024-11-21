"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientCourseController = void 0;
const courseService_1 = require("../services/courseService");
const categoryService_1 = require("../services/categoryService");
const enrollmentService_1 = require("../services/enrollmentService");
const catchAsync_1 = require("../../../utils/helpers/catchAsync");
const appResponse_1 = require("../../../utils/helpers/appResponse");
const helpers_1 = require("../../../utils/helpers");
class ClientCourseController {
}
exports.ClientCourseController = ClientCourseController;
_a = ClientCourseController;
ClientCourseController.getPublishedCourses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit, filter } = (0, helpers_1.extractListOptions)(req);
    const courses = await courseService_1.CourseService.getPublishedCourses(filter, { page, limit });
    return (0, appResponse_1.successResponse)(courses, res, { message: 'Courses fetched successfully' });
});
ClientCourseController.getCourseDetails = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const course = await courseService_1.CourseService.getCourseById(id);
    if (!course || !course.isPublished) {
        return (0, appResponse_1.errorResponse)('Course not found', res);
    }
    return (0, appResponse_1.successResponse)(course, res, { message: 'Course details fetched successfully' });
});
ClientCourseController.getCategories = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const categories = await categoryService_1.CategoryService.getActiveCategories();
    return (0, appResponse_1.successResponse)(categories, res, { message: 'Categories fetched successfully' });
});
ClientCourseController.getMyEnrollments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
    const enrollments = await enrollmentService_1.EnrollmentService.getUserEnrollments(userId);
    return (0, appResponse_1.successResponse)(enrollments, res, { message: 'Enrollments fetched successfully' });
});
ClientCourseController.enrollInCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id: courseId } = req.params;
    const userId = req.user._id;
    const enrollmentData = req.body;
    const enrollment = await enrollmentService_1.EnrollmentService.createEnrollment(courseId, userId, enrollmentData);
    return (0, appResponse_1.successResponse)(enrollment, res, { message: 'Successfully enrolled in course' });
});
ClientCourseController.getMyCourses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    const options = (0, helpers_1.extractListOptions)(req);
    const courses = await enrollmentService_1.EnrollmentService.getUserEnrollments(userId);
    return (0, appResponse_1.successResponse)(courses, res, { message: 'Courses fetched successfully' });
});
ClientCourseController.reviewCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id: enrollmentId } = req.params;
    const { rating, review } = req.body;
    const enrollment = await enrollmentService_1.EnrollmentService.addReview(enrollmentId, rating, review);
    return (0, appResponse_1.successResponse)(enrollment, res, { message: 'Review added successfully' });
});
ClientCourseController.updateProgress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id: enrollmentId } = req.params;
    const { progress } = req.body;
    const enrollment = await enrollmentService_1.EnrollmentService.updateEnrollmentProgress(enrollmentId, progress);
    if (!enrollment) {
        return (0, appResponse_1.errorResponse)('Enrollment not found', res);
    }
    return (0, appResponse_1.successResponse)(enrollment, res, { message: 'Progress updated successfully' });
});
