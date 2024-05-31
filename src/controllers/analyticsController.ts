import { Request, Response } from 'express';
import { 
    getPopularCourses, 
    getTotalEnrolledUsers, 
    getUpcomingWebinars, 
    getCoursesByCategory, 
    getTotalRevenue, 
    getTopRatedCourses, 
    getTotalCourses, 
    getTotalUsers, 
    getUserEnrollments,
    getImportantEntitiesCount, 
    getTotalRevenueWithComparision,
    getYearlySalesData
} from '@/service/analyticsService';
import { successResponse, errorResponse } from '@/utils/helpers/appResponse';
import { catchAsync } from '@/utils/helpers/catchAsync';

// Function to get popular courses
const getPopularCoursesController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const options = { ...req.query };
    const popularCourses = await getPopularCourses(options);
    successResponse(popularCourses, res, { message: "Popular courses fetched successfully!" });
});

// Function to get total enrolled users
const getTotalEnrolledUsersController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const options = { ...req.query };
    const totalEnrolledUsers = await getTotalEnrolledUsers(options);
    successResponse(totalEnrolledUsers, res, { message: "Total enrolled users fetched successfully!" });
});

// Function to get upcoming webinars
const getUpcomingWebinarsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const options = { ...req.query };
    const upcomingWebinars = await getUpcomingWebinars(options);
    successResponse(upcomingWebinars, res, { message: "Upcoming webinars fetched successfully!" });
});

// Function to get courses by category
const getCoursesByCategoryController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { categoryId } = req.params;
    const options = { ...req.query };
    const coursesByCategory = await getCoursesByCategory(categoryId, options);
    successResponse(coursesByCategory, res, { message: `Courses for category ${categoryId} fetched successfully!"` });
});

// Function to get total revenue
const getTotalRevenueController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const filter = { ...req.query } as any;
    const totalRevenue = await getTotalRevenue(filter.startDate ||  new Date());
    successResponse(totalRevenue, res, { message: "Total revenue fetched successfully!" });
});

// Function to get top rated courses
const getTopRatedCoursesController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { limit } = req.query;
    const topRatedCourses = await getTopRatedCourses(Number(limit) || 10);
    successResponse(topRatedCourses, res, { message: "Top rated courses fetched successfully!" });
});

// Function to get total courses
const getTotalCoursesController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const filter = { ...req.query };
    const totalCourses = await getTotalCourses(filter);
    successResponse({ totalCourses }, res, { message: "Total courses fetched successfully!" });
});

// Function to get total users
const getTotalUsersController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const filter = { ...req.query };
    const totalUsers = await getTotalUsers(filter);
    successResponse({ totalUsers }, res, { message: "Total users fetched successfully!" });
});

// Function to get user enrollments
const getUserEnrollmentsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const options = { ...req.query };
    const userEnrollments = await getUserEnrollments(userId, options);
    successResponse(userEnrollments, res, { message: `Enrollments for user ${userId} fetched successfully!` });
});

// Function to get count of important entities
const getImportantEntitiesCountController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const filter = { ...req.query };
    const counts = await getImportantEntitiesCount(filter);
    successResponse(counts, res, { message: "Counts of important entities fetched successfully!" });
});

const getYearlySalesDataController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    try {
        const { year } = req.query;
        if (!year) {
            return errorResponse('Error: 400: Year is required.', res);
        }

        const salesData = await getYearlySalesData(parseInt(year as string, 10));
        return successResponse(salesData, res, { message: 'Yearly sales data fetched successfully!' });
    } catch (error: any) {
        return errorResponse(error.message, res);
    }
});

export {
    getPopularCoursesController,
    getTotalEnrolledUsersController,
    getUpcomingWebinarsController,
    getCoursesByCategoryController,
    getTotalRevenueController,
    getTopRatedCoursesController,
    getTotalCoursesController,
    getTotalUsersController,
    getUserEnrollmentsController,
    getImportantEntitiesCountController,
    getYearlySalesData,
    getYearlySalesDataController
};
