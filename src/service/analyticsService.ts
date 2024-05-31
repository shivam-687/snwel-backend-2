import CourseEnrollmentModel, { CourseEnrollment } from "@/models/CourseEnrollment";
import { Course, CourseModel } from "@/models/CourseModel";
import { UserModel } from "@/models/User";
import { Webinar, WebinarModel } from "@/models/WebinarModel"; // Adjust the import path as necessary
import { FilterOptions, ListOptions, PaginatedList } from "@/types/custom";
import { convertToPagination, getPaginationParams } from "@/utils/helpers";
import { ObjectId } from 'mongodb';
import { startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear } from 'date-fns';



export const getImportantEntitiesCount = async (options?: FilterOptions) => {
    try {
        const courseQuery: any = {};
        const userQuery: any = {};
        const enrollmentQuery: any = { status: 'ACTIVE' };
        const webinarQuery: any = { isActive: true };

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
            CourseModel.countDocuments(courseQuery).exec(),
            UserModel.countDocuments(userQuery).exec(),
            CourseEnrollmentModel.countDocuments(enrollmentQuery).exec(),
            WebinarModel.countDocuments(webinarQuery).exec()
        ]);

        return {
            totalCourses,
            totalUsers,
            totalEnrollments,
            totalWebinars
        };
    } catch (error: any) {
        throw new Error(`Error fetching important entities count: ${error.message}`);
    }
};

// Fetch popular courses with pagination and filters
export const getPopularCourses = async (options: ListOptions): Promise<PaginatedList<Course>> => {
    try {
        const { limit = 10, page = 1, filter, search } = options;
        const query: any = { isPopular: true };
        const paginationData = getPaginationParams(limit, page);

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ title: searchRegex }, { shortDescription: searchRegex }];
        }

        if (filter) {
            if (filter.categoryIds && filter.categoryIds.length > 0) {
                query['categories'] = { $in: filter.categoryIds.map((ctg: any) => new ObjectId(ctg)) };
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
        const courses = await CourseModel.find(query).skip(skip).limit(limit).populate(['instructors', 'categories']);
        const count = await CourseModel.countDocuments(query);
        return convertToPagination(courses, count, paginationData.limit, paginationData.offset);
    } catch (error: any) {
        throw new Error(`Error retrieving popular courses: ${error.message}`);
    }
};

// Fetch total number of enrolled users
export const getTotalEnrolledUsers = async (options: ListOptions): Promise<PaginatedList<CourseEnrollment>> => {
    try {
        const { limit = 10, page = 1, filter } = options;
        const query: any = { status: 'ACTIVE' };
        const paginationData = getPaginationParams(limit, page);

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
        const enrollments = await CourseEnrollmentModel.find(query).skip(skip).limit(limit).populate("userId", ["email", "name", "profilePic"])
        .populate("courseId", "title slug currency price")
        .select(['_id', "status", "paymentStatus", "otp.verified", "createdAt", "updatedAt", "paymentMethod"]);;
        const count = await CourseEnrollmentModel.countDocuments(query);
        return convertToPagination(enrollments, count, paginationData.limit, paginationData.offset);
    } catch (error: any) {
        throw new Error(`Error retrieving total enrolled users: ${error.message}`);
    }
};

// Fetch upcoming webinars with pagination and filters
export const getUpcomingWebinars = async (options: ListOptions): Promise<PaginatedList<Webinar>> => {
    try {
        const { limit = 10, page = 1, filter, search } = options;
        const query: any = { isActive: true };
        const paginationData = getPaginationParams(limit, page);

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
        const webinars = await WebinarModel.find(query).skip(skip).limit(limit).populate('hosts');
        const count = await WebinarModel.countDocuments(query);
        return convertToPagination(webinars, count, paginationData.limit, paginationData.offset);
    } catch (error: any) {
        throw new Error(`Error retrieving upcoming webinars: ${error.message}`);
    }
};

// Fetch courses by category with pagination and filters
export const getCoursesByCategory = async (categoryId: string, options: ListOptions): Promise<PaginatedList<Course>> => {
    try {
        const { limit = 10, page = 1, filter, search } = options;
        const query: any = { categories: categoryId };
        const paginationData = getPaginationParams(limit, page);

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
        const courses = await CourseModel.find(query).skip(skip).limit(limit).populate(['instructors', 'categories']);
        const count = await CourseModel.countDocuments(query);
        return convertToPagination(courses, count, paginationData.limit, paginationData.offset);
    } catch (error: any) {
        throw new Error(`Error retrieving courses by category: ${error.message}`);
    }
};

// Fetch total revenue from course enrollments with filters
export const getTotalRevenueWithComparision = async (options?: FilterOptions): Promise<number> => {
    try {
        const query: any = { paymentStatus: 'PAID' };

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

        const enrollments = await CourseEnrollmentModel.find(query).populate('courseId');
        const totalRevenue = enrollments.reduce((total, enrollment) => {
            const course = enrollment.courseId as any; // Casting to any to access course properties
            return total + course.price;
        }, 0);
        return totalRevenue;
    } catch (error: any) {
        throw new Error(`Error calculating total revenue: ${error.message}`);
    }
};

export const getTotalRevenue = async (startDate: Date): Promise<{ amount: number; currency: string; comparison: number }> => {
    try {
        const selectedMonthStart = startOfMonth(startDate);
        const selectedMonthEnd = endOfMonth(startDate);
        const previousMonthStart = startOfMonth(subMonths(startDate, 1));
        const previousMonthEnd = endOfMonth(subMonths(startDate, 1));

        const selectedMonthRevenue = await CourseEnrollmentModel.aggregate([
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

        const previousMonthRevenue = await CourseEnrollmentModel.aggregate([
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
    } catch (error: any) {
        throw new Error(`Error: 500: Error in fetching total revenue: ${error.message}`);
    }
};

// Fetch top rated courses with pagination
export const getTopRatedCourses = async (limit: number): Promise<Course[]> => {
    try {
        const courses = await CourseModel.find().sort({ rating: -1 }).limit(limit).populate(['instructors', 'categories']);
        return courses;
    } catch (error: any) {
        throw new Error(`Error fetching top rated courses: ${error.message}`);
    }
};

// Fetch total number of courses with filters
export const getTotalCourses = async (options?: FilterOptions): Promise<number> => {
    try {
        const query: any = {};

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

        const count = await CourseModel.countDocuments(query).exec();
        return count;
    } catch (error: any) {
        throw new Error(`Error fetching total courses: ${error.message}`);
    }
};

// Fetch total number of users with filters
export const getTotalUsers = async (options?: FilterOptions): Promise<number> => {
    try {
        const query: any = {};

        if (options && options.filter) {
            const filter = options.filter;
            if (filter?.roles && filter?.roles.length > 0) {
                query['roles'] = { $in: filter.roles };
            }
        }

        const count = await UserModel.countDocuments(query).exec();
        return count;
    } catch (error: any) {
        throw new Error(`Error fetching total users: ${error.message}`);
    }
};

// Fetch user enrollments with pagination and filters
export const getUserEnrollments = async (userId: string, options: ListOptions): Promise<PaginatedList<CourseEnrollment>> => {
    try {
        const { limit = 10, page = 1, filter } = options;
        const query: any = { userId: new ObjectId(userId) };
        const paginationData = getPaginationParams(limit, page);

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
        const enrollments = await CourseEnrollmentModel.find(query).skip(skip).limit(limit).populate(['courseId', "userId"]);
        const count = await CourseEnrollmentModel.countDocuments(query);
        return convertToPagination(enrollments, count, paginationData.limit, paginationData.offset);
    } catch (error: any) {
        throw new Error(`Error fetching user enrollments: ${error.message}`);
    }
};

export const getYearlySalesData = async (year: number): Promise<{ month: string; totalAmount: number }[]> => {
    try {
        const yearStart = startOfYear(new Date(year, 0));
        const yearEnd = endOfYear(new Date(year, 0));

        const salesData = await CourseEnrollmentModel.aggregate([
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

        console.log({salesData})
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
    } catch (error: any) {
        throw new Error(`Error: 500: Error in fetching yearly sales data: ${error.message}`);
    }
};
