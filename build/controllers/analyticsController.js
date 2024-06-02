"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYearlySalesDataController = exports.getYearlySalesData = exports.getImportantEntitiesCountController = exports.getUserEnrollmentsController = exports.getTotalUsersController = exports.getTotalCoursesController = exports.getTopRatedCoursesController = exports.getTotalRevenueController = exports.getCoursesByCategoryController = exports.getUpcomingWebinarsController = exports.getTotalEnrolledUsersController = exports.getPopularCoursesController = void 0;
const analyticsService_1 = require("../service/analyticsService");
Object.defineProperty(exports, "getYearlySalesData", { enumerable: true, get: function () { return analyticsService_1.getYearlySalesData; } });
const appResponse_1 = require("../utils/helpers/appResponse");
const catchAsync_1 = require("../utils/helpers/catchAsync");
// Function to get popular courses
const getPopularCoursesController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const options = { ...req.query };
    const popularCourses = await (0, analyticsService_1.getPopularCourses)(options);
    (0, appResponse_1.successResponse)(popularCourses, res, { message: "Popular courses fetched successfully!" });
});
exports.getPopularCoursesController = getPopularCoursesController;
// Function to get total enrolled users
const getTotalEnrolledUsersController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const options = { ...req.query };
    const totalEnrolledUsers = await (0, analyticsService_1.getTotalEnrolledUsers)(options);
    (0, appResponse_1.successResponse)(totalEnrolledUsers, res, { message: "Total enrolled users fetched successfully!" });
});
exports.getTotalEnrolledUsersController = getTotalEnrolledUsersController;
// Function to get upcoming webinars
const getUpcomingWebinarsController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const options = { ...req.query };
    const upcomingWebinars = await (0, analyticsService_1.getUpcomingWebinars)(options);
    (0, appResponse_1.successResponse)(upcomingWebinars, res, { message: "Upcoming webinars fetched successfully!" });
});
exports.getUpcomingWebinarsController = getUpcomingWebinarsController;
// Function to get courses by category
const getCoursesByCategoryController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { categoryId } = req.params;
    const options = { ...req.query };
    const coursesByCategory = await (0, analyticsService_1.getCoursesByCategory)(categoryId, options);
    (0, appResponse_1.successResponse)(coursesByCategory, res, { message: `Courses for category ${categoryId} fetched successfully!"` });
});
exports.getCoursesByCategoryController = getCoursesByCategoryController;
// Function to get total revenue
const getTotalRevenueController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const filter = { ...req.query };
    const totalRevenue = await (0, analyticsService_1.getTotalRevenue)(filter.startDate || new Date());
    (0, appResponse_1.successResponse)(totalRevenue, res, { message: "Total revenue fetched successfully!" });
});
exports.getTotalRevenueController = getTotalRevenueController;
// Function to get top rated courses
const getTopRatedCoursesController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { limit } = req.query;
    const topRatedCourses = await (0, analyticsService_1.getTopRatedCourses)(Number(limit) || 10);
    (0, appResponse_1.successResponse)(topRatedCourses, res, { message: "Top rated courses fetched successfully!" });
});
exports.getTopRatedCoursesController = getTopRatedCoursesController;
// Function to get total courses
const getTotalCoursesController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const filter = { ...req.query };
    const totalCourses = await (0, analyticsService_1.getTotalCourses)(filter);
    (0, appResponse_1.successResponse)({ totalCourses }, res, { message: "Total courses fetched successfully!" });
});
exports.getTotalCoursesController = getTotalCoursesController;
// Function to get total users
const getTotalUsersController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const filter = { ...req.query };
    const totalUsers = await (0, analyticsService_1.getTotalUsers)(filter);
    (0, appResponse_1.successResponse)({ totalUsers }, res, { message: "Total users fetched successfully!" });
});
exports.getTotalUsersController = getTotalUsersController;
// Function to get user enrollments
const getUserEnrollmentsController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.params;
    const options = { ...req.query };
    const userEnrollments = await (0, analyticsService_1.getUserEnrollments)(userId, options);
    (0, appResponse_1.successResponse)(userEnrollments, res, { message: `Enrollments for user ${userId} fetched successfully!` });
});
exports.getUserEnrollmentsController = getUserEnrollmentsController;
// Function to get count of important entities
const getImportantEntitiesCountController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const filter = { ...req.query };
    const counts = await (0, analyticsService_1.getImportantEntitiesCount)(filter);
    (0, appResponse_1.successResponse)(counts, res, { message: "Counts of important entities fetched successfully!" });
});
exports.getImportantEntitiesCountController = getImportantEntitiesCountController;
const getYearlySalesDataController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    try {
        const { year } = req.query;
        if (!year) {
            return (0, appResponse_1.errorResponse)('Error: 400: Year is required.', res);
        }
        const salesData = await (0, analyticsService_1.getYearlySalesData)(parseInt(year, 10));
        return (0, appResponse_1.successResponse)(salesData, res, { message: 'Yearly sales data fetched successfully!' });
    }
    catch (error) {
        return (0, appResponse_1.errorResponse)(error.message, res);
    }
});
exports.getYearlySalesDataController = getYearlySalesDataController;
