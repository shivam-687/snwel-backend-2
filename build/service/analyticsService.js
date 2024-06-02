"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYearlySalesData = exports.getUserEnrollments = exports.getTotalUsers = exports.getTotalCourses = exports.getTopRatedCourses = exports.getTotalRevenue = exports.getTotalRevenueWithComparision = exports.getCoursesByCategory = exports.getUpcomingWebinars = exports.getTotalEnrolledUsers = exports.getPopularCourses = exports.getImportantEntitiesCount = void 0;
const CourseEnrollment_1 = __importDefault(require("../models/CourseEnrollment"));
const CourseModel_1 = require("../models/CourseModel");
const User_1 = require("../models/User");
const WebinarModel_1 = require("../models/WebinarModel"); // Adjust the import path as necessary
const helpers_1 = require("../utils/helpers");
const mongodb_1 = require("mongodb");
const date_fns_1 = require("date-fns");
const getImportantEntitiesCount = async (options) => {
    try {
        const courseQuery = {};
        const userQuery = {};
        const enrollmentQuery = { status: 'ACTIVE' };
        const webinarQuery = { isActive: true };
        if (options && options.filter) {
            const filter = options.filter;
            if (filter.startDate) {
                const startDate = new Date(filter.startDate);
                courseQuery['createdAt'] = { $gte: startDate };
                enrollmentQuery['createdAt'] = { $gte: startDate };
                webinarQuery['startDate'] = { $gte: startDate };
            }
            if (filter.endDate) {
                const endDate = new Date(filter.endDate);
                courseQuery['createdAt'] = courseQuery['createdAt'] || {};
                courseQuery['createdAt'].$lte = endDate;
                enrollmentQuery['createdAt'] = enrollmentQuery['createdAt'] || {};
                enrollmentQuery['createdAt'].$lte = endDate;
                webinarQuery['startDate'] = webinarQuery['startDate'] || {};
                webinarQuery['startDate'].$lte = endDate;
            }
        }
        // Fetch counts in parallel
        const [totalCourses, totalUsers, totalEnrollments, totalWebinars] = await Promise.all([
            CourseModel_1.CourseModel.countDocuments(courseQuery).exec(),
            User_1.UserModel.countDocuments(userQuery).exec(),
            CourseEnrollment_1.default.countDocuments(enrollmentQuery).exec(),
            WebinarModel_1.WebinarModel.countDocuments(webinarQuery).exec()
        ]);
        return {
            totalCourses,
            totalUsers,
            totalEnrollments,
            totalWebinars
        };
    }
    catch (error) {
        throw new Error(`Error fetching important entities count: ${error.message}`);
    }
};
exports.getImportantEntitiesCount = getImportantEntitiesCount;
// Fetch popular courses with pagination and filters
const getPopularCourses = async (options) => {
    try {
        const { limit = 10, page = 1, filter, search } = options;
        const query = { isPopular: true };
        const paginationData = (0, helpers_1.getPaginationParams)(limit, page);
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ title: searchRegex }, { shortDescription: searchRegex }];
        }
        if (filter) {
            if (filter.categoryIds && filter.categoryIds.length > 0) {
                query['categories'] = { $in: filter.categoryIds.map((ctg) => new mongodb_1.ObjectId(ctg)) };
            }
            if (filter.startDate) {
                query['createdAt'] = { $gte: new Date(filter.startDate) };
            }
            if (filter.endDate) {
                query['createdAt'] = query['createdAt'] || {};
                query['createdAt'].$lte = new Date(filter.endDate);
            }
        }
        const skip = (page - 1) * limit;
        const courses = await CourseModel_1.CourseModel.find(query).skip(skip).limit(limit).populate(['instructors', 'categories']);
        const count = await CourseModel_1.CourseModel.countDocuments(query);
        return (0, helpers_1.convertToPagination)(courses, count, paginationData.limit, paginationData.offset);
    }
    catch (error) {
        throw new Error(`Error retrieving popular courses: ${error.message}`);
    }
};
exports.getPopularCourses = getPopularCourses;
// Fetch total number of enrolled users
const getTotalEnrolledUsers = async (options) => {
    try {
        const { limit = 10, page = 1, filter } = options;
        const query = { status: 'ACTIVE' };
        const paginationData = (0, helpers_1.getPaginationParams)(limit, page);
        if (filter) {
            if (filter.startDate) {
                query['createdAt'] = { $gte: new Date(filter.startDate) };
            }
            if (filter.endDate) {
                query['createdAt'] = query['createdAt'] || {};
                query['createdAt'].$lte = new Date(filter.endDate);
            }
        }
        const skip = (page - 1) * limit;
        const enrollments = await CourseEnrollment_1.default.find(query).skip(skip).limit(limit).populate("userId", ["email", "name", "profilePic"])
            .populate("courseId", "title slug currency price")
            .select(['_id', "status", "paymentStatus", "otp.verified", "createdAt", "updatedAt", "paymentMethod"]);
        ;
        const count = await CourseEnrollment_1.default.countDocuments(query);
        return (0, helpers_1.convertToPagination)(enrollments, count, paginationData.limit, paginationData.offset);
    }
    catch (error) {
        throw new Error(`Error retrieving total enrolled users: ${error.message}`);
    }
};
exports.getTotalEnrolledUsers = getTotalEnrolledUsers;
// Fetch upcoming webinars with pagination and filters
const getUpcomingWebinars = async (options) => {
    try {
        const { limit = 10, page = 1, filter, search } = options;
        const query = { isActive: true };
        const paginationData = (0, helpers_1.getPaginationParams)(limit, page);
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ title: searchRegex }, { shortDescription: searchRegex }];
        }
        if (filter) {
            if (filter.startDate) {
                query['startDate'] = { $gte: new Date(filter.startDate) };
            }
            if (filter.endDate) {
                query['startDate'] = query['startDate'] || {};
                query['startDate'].$lte = new Date(filter.endDate);
            }
        }
        const skip = (page - 1) * limit;
        const webinars = await WebinarModel_1.WebinarModel.find(query).skip(skip).limit(limit).populate('hosts');
        const count = await WebinarModel_1.WebinarModel.countDocuments(query);
        return (0, helpers_1.convertToPagination)(webinars, count, paginationData.limit, paginationData.offset);
    }
    catch (error) {
        throw new Error(`Error retrieving upcoming webinars: ${error.message}`);
    }
};
exports.getUpcomingWebinars = getUpcomingWebinars;
// Fetch courses by category with pagination and filters
const getCoursesByCategory = async (categoryId, options) => {
    try {
        const { limit = 10, page = 1, filter, search } = options;
        const query = { categories: categoryId };
        const paginationData = (0, helpers_1.getPaginationParams)(limit, page);
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ title: searchRegex }, { shortDescription: searchRegex }];
        }
        if (filter) {
            if (filter.startDate) {
                query['createdAt'] = { $gte: new Date(filter.startDate) };
            }
            if (filter.endDate) {
                query['createdAt'] = query['createdAt'] || {};
                query['createdAt'].$lte = new Date(filter.endDate);
            }
        }
        const skip = (page - 1) * limit;
        const courses = await CourseModel_1.CourseModel.find(query).skip(skip).limit(limit).populate(['instructors', 'categories']);
        const count = await CourseModel_1.CourseModel.countDocuments(query);
        return (0, helpers_1.convertToPagination)(courses, count, paginationData.limit, paginationData.offset);
    }
    catch (error) {
        throw new Error(`Error retrieving courses by category: ${error.message}`);
    }
};
exports.getCoursesByCategory = getCoursesByCategory;
// Fetch total revenue from course enrollments with filters
const getTotalRevenueWithComparision = async (options) => {
    try {
        const query = { paymentStatus: 'PAID' };
        if (options && options.filter) {
            const filter = options.filter;
            if (filter.startDate) {
                query['createdAt'] = { $gte: new Date(filter.startDate) };
            }
            if (filter.endDate) {
                query['createdAt'] = query['createdAt'] || {};
                query['createdAt'].$lte = new Date(filter.endDate);
            }
        }
        const enrollments = await CourseEnrollment_1.default.find(query).populate('courseId');
        const totalRevenue = enrollments.reduce((total, enrollment) => {
            const course = enrollment.courseId; // Casting to any to access course properties
            return total + course.price;
        }, 0);
        return totalRevenue;
    }
    catch (error) {
        throw new Error(`Error calculating total revenue: ${error.message}`);
    }
};
exports.getTotalRevenueWithComparision = getTotalRevenueWithComparision;
const getTotalRevenue = async (startDate) => {
    try {
        const selectedMonthStart = (0, date_fns_1.startOfMonth)(startDate);
        const selectedMonthEnd = (0, date_fns_1.endOfMonth)(startDate);
        const previousMonthStart = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(startDate, 1));
        const previousMonthEnd = (0, date_fns_1.endOfMonth)((0, date_fns_1.subMonths)(startDate, 1));
        const selectedMonthRevenue = await CourseEnrollment_1.default.aggregate([
            {
                $match: {
                    paymentStatus: 'PAID',
                    updatedAt: { $gte: selectedMonthStart, $lte: selectedMonthEnd }
                }
            },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'courseId',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            {
                $unwind: '$course'
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$course.price' }
                }
            }
        ]);
        const previousMonthRevenue = await CourseEnrollment_1.default.aggregate([
            {
                $match: {
                    paymentStatus: 'PAID',
                    updatedAt: { $gte: previousMonthStart, $lte: previousMonthEnd }
                }
            },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'courseId',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            {
                $unwind: '$course'
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$course.price' }
                }
            }
        ]);
        const currentAmount = selectedMonthRevenue[0]?.totalAmount || 0;
        const previousAmount = previousMonthRevenue[0]?.totalAmount || 0;
        const comparison = currentAmount - previousAmount;
        return {
            amount: currentAmount,
            currency: 'INR', // Assuming the currency is INR, adjust if needed
            comparison: comparison
        };
    }
    catch (error) {
        throw new Error(`Error: 500: Error in fetching total revenue: ${error.message}`);
    }
};
exports.getTotalRevenue = getTotalRevenue;
// Fetch top rated courses with pagination
const getTopRatedCourses = async (limit) => {
    try {
        const courses = await CourseModel_1.CourseModel.find().sort({ rating: -1 }).limit(limit).populate(['instructors', 'categories']);
        return courses;
    }
    catch (error) {
        throw new Error(`Error fetching top rated courses: ${error.message}`);
    }
};
exports.getTopRatedCourses = getTopRatedCourses;
// Fetch total number of courses with filters
const getTotalCourses = async (options) => {
    try {
        const query = {};
        if (options && options.filter) {
            const filter = options.filter;
            if (filter.startDate) {
                query['createdAt'] = { $gte: new Date(filter.startDate) };
            }
            if (filter.endDate) {
                query['createdAt'] = query['createdAt'] || {};
                query['createdAt'].$lte = new Date(filter.endDate);
            }
        }
        const count = await CourseModel_1.CourseModel.countDocuments(query).exec();
        return count;
    }
    catch (error) {
        throw new Error(`Error fetching total courses: ${error.message}`);
    }
};
exports.getTotalCourses = getTotalCourses;
// Fetch total number of users with filters
const getTotalUsers = async (options) => {
    try {
        const query = {};
        if (options && options.filter) {
            const filter = options.filter;
            if (filter?.roles && filter?.roles.length > 0) {
                query['roles'] = { $in: filter.roles };
            }
        }
        const count = await User_1.UserModel.countDocuments(query).exec();
        return count;
    }
    catch (error) {
        throw new Error(`Error fetching total users: ${error.message}`);
    }
};
exports.getTotalUsers = getTotalUsers;
// Fetch user enrollments with pagination and filters
const getUserEnrollments = async (userId, options) => {
    try {
        const { limit = 10, page = 1, filter } = options;
        const query = { userId: new mongodb_1.ObjectId(userId) };
        const paginationData = (0, helpers_1.getPaginationParams)(limit, page);
        if (filter) {
            if (filter.startDate) {
                query['createdAt'] = { $gte: new Date(filter.startDate) };
            }
            if (filter.endDate) {
                query['createdAt'] = query['createdAt'] || {};
                query['createdAt'].$lte = new Date(filter.endDate);
            }
        }
        const skip = (page - 1) * limit;
        const enrollments = await CourseEnrollment_1.default.find(query).skip(skip).limit(limit).populate(['courseId', "userId"]);
        const count = await CourseEnrollment_1.default.countDocuments(query);
        return (0, helpers_1.convertToPagination)(enrollments, count, paginationData.limit, paginationData.offset);
    }
    catch (error) {
        throw new Error(`Error fetching user enrollments: ${error.message}`);
    }
};
exports.getUserEnrollments = getUserEnrollments;
const getYearlySalesData = async (year) => {
    try {
        const yearStart = (0, date_fns_1.startOfYear)(new Date(year, 0));
        const yearEnd = (0, date_fns_1.endOfYear)(new Date(year, 0));
        const salesData = await CourseEnrollment_1.default.aggregate([
            {
                $match: {
                    paymentStatus: 'PAID',
                    updatedAt: { $gte: yearStart, $lte: yearEnd }
                }
            },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'courseId',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            {
                $unwind: '$course'
            },
            {
                $group: {
                    _id: { month: { $month: '$updatedAt' } },
                    totalAmount: { $sum: '$course.price' }
                }
            },
            {
                $sort: { '_id.month': 1 }
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id.month',
                    totalAmount: 1
                }
            }
        ]);
        console.log({ salesData });
        // Mapping months to their names
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const fullYearData = monthNames.map((month, index) => ({
            month,
            totalAmount: 0
        }));
        // Merge sales data with full year data
        salesData.forEach(data => {
            fullYearData[data.month - 1].totalAmount = data.totalAmount;
        });
        return fullYearData;
    }
    catch (error) {
        throw new Error(`Error: 500: Error in fetching yearly sales data: ${error.message}`);
    }
};
exports.getYearlySalesData = getYearlySalesData;
