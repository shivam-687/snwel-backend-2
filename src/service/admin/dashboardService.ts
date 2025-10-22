import { CourseModel } from '@/models/CourseModel';
import CourseEnrollmentModel from '@/models/CourseEnrollment';
import { UserModel } from '@/models/User';
import SnwelEnquiryModel from '@/models/SnwelEnquiry';
import { startOfMonth, endOfMonth, subMonths, format, parseISO } from 'date-fns';

interface RevenueTrendOptions {
  period?: string;
  startDate?: string;
  endDate?: string;
}

interface TopCoursesOptions {
  limit: number;
  period: string;
}

interface ActivityFeedOptions {
  limit: number;
  types?: string[];
}

/**
 * Get dashboard overview statistics
 */
export const getDashboardStats = async () => {
  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const startOfLastMonth = startOfMonth(subMonths(now, 1));
  const endOfLastMonth = endOfMonth(subMonths(now, 1));

  // Revenue calculation (sum of course prices from enrollments with status completed/active)
  const totalRevenue = await CourseEnrollmentModel.aggregate([
    { $match: { status: { $in: ['completed', 'active'] } } },
    { $lookup: { from: 'courses', localField: 'courseId', foreignField: '_id', as: 'course' } },
    { $unwind: '$course' },
    { $group: { _id: null, total: { $sum: '$course.pricing.amount' } } },
  ]);

  const lastMonthRevenue = await CourseEnrollmentModel.aggregate([
    {
      $match: {
        status: { $in: ['completed', 'active'] },
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      },
    },
    { $lookup: { from: 'courses', localField: 'courseId', foreignField: '_id', as: 'course' } },
    { $unwind: '$course' },
    { $group: { _id: null, total: { $sum: '$course.pricing.amount' } } },
  ]);

  const thisMonthRevenue = await CourseEnrollmentModel.aggregate([
    {
      $match: {
        status: { $in: ['completed', 'active'] },
        createdAt: { $gte: startOfCurrentMonth },
      },
    },
    { $lookup: { from: 'courses', localField: 'courseId', foreignField: '_id', as: 'course' } },
    { $unwind: '$course' },
    { $group: { _id: null, total: { $sum: '$course.pricing.amount' } } },
  ]);

  const revenueTotal = totalRevenue[0]?.total || 0;
  const lastMonthTotal = lastMonthRevenue[0]?.total || 0;
  const thisMonthTotal = thisMonthRevenue[0]?.total || 0;
  const revenueChange = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

  // Courses
  const totalCourses = await CourseModel.countDocuments();
  const publishedCourses = await CourseModel.countDocuments({ status: 'PUBLISHED' });
  const draftCourses = await CourseModel.countDocuments({ status: 'SAVED' });

  // Enrollments
  const totalEnrollments = await CourseEnrollmentModel.countDocuments();
  const enrollmentsThisMonth = await CourseEnrollmentModel.countDocuments({
    createdAt: { $gte: startOfCurrentMonth },
  });
  const enrollmentsLastMonth = await CourseEnrollmentModel.countDocuments({
    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
  });
  const enrollmentChange =
    enrollmentsLastMonth > 0
      ? ((enrollmentsThisMonth - enrollmentsLastMonth) / enrollmentsLastMonth) * 100
      : 0;

  // Enquiries
  const totalEnquiries = await SnwelEnquiryModel.countDocuments();
  const pendingEnquiries = await SnwelEnquiryModel.countDocuments({ status: 'PENDING' });
  const resolvedEnquiries = await SnwelEnquiryModel.countDocuments({ status: 'RESOLVED' });

  return {
    revenue: {
      total: revenueTotal,
      change: Number(revenueChange.toFixed(2)),
      trend: revenueChange >= 0 ? 'up' : 'down',
    },
    courses: {
      total: totalCourses,
      published: publishedCourses,
      drafts: draftCourses,
    },
    enrollments: {
      total: totalEnrollments,
      thisMonth: enrollmentsThisMonth,
      change: Number(enrollmentChange.toFixed(2)),
    },
    enquiries: {
      total: totalEnquiries,
      pending: pendingEnquiries,
      resolved: resolvedEnquiries,
    },
  };
};

/**
 * Get revenue trend data for charts
 */
export const getRevenueTrend = async (options: RevenueTrendOptions) => {
  const { period = '6months', startDate, endDate } = options;
  
  let start: Date;
  let end: Date = new Date();
  
  if (startDate && endDate) {
    start = parseISO(startDate);
    end = parseISO(endDate);
  } else {
    const monthsBack = period === '12months' ? 12 : 6;
    start = subMonths(end, monthsBack);
  }

  const enrollments = await CourseEnrollmentModel.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        status: { $in: ['completed', 'active'] },
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'courseId',
        foreignField: '_id',
        as: 'course',
      },
    },
    { $unwind: '$course' },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$course.pricing.amount' },
        enrollments: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const data = enrollments.map((item) => ({
    month: monthNames[item._id.month - 1],
    revenue: item.revenue || 0,
    enrollments: item.enrollments || 0,
  }));

  const total = data.reduce((sum, item) => sum + item.revenue, 0);
  const average = data.length > 0 ? total / data.length : 0;

  return {
    data,
    total,
    average: Math.round(average),
  };
};

/**
 * Get top performing courses
 */
export const getTopPerformingCourses = async (options: TopCoursesOptions) => {
  const { limit, period } = options;
  
  let startDate: Date;
  const now = new Date();
  
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'quarter':
      startDate = subMonths(now, 3);
      break;
    case 'year':
      startDate = subMonths(now, 12);
      break;
    case 'month':
    default:
      startDate = startOfMonth(now);
      break;
  }

  const topCourses = await CourseEnrollmentModel.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $in: ['completed', 'active'] },
      },
    },
    {
      $group: {
        _id: '$courseId',
        enrollments: { $sum: 1 },
      },
    },
    { $sort: { enrollments: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: '_id',
        as: 'course',
      },
    },
    { $unwind: '$course' },
  ]);

  return topCourses.map((item) => ({
    courseId: item._id,
    title: item.course.title || 'Untitled',
    enrollments: item.enrollments,
    revenue: item.enrollments * (item.course.pricing?.amount || 0),
    trend: 'up', // Could be enhanced with historical comparison
    percentageChange: 0, // Could be enhanced with historical comparison
  }));
};

/**
 * Get recent enrollments
 */
export const getRecentEnrollments = async (limit: number) => {
  const enrollments = await CourseEnrollmentModel.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'name email profilePic')
    .populate('courseId', 'title')
    .lean();

  return enrollments.map((enrollment: any) => ({
    enrollmentId: enrollment._id,
    user: {
      name: enrollment.userId?.name || 'Anonymous',
      email: enrollment.userId?.email || 'N/A',
      avatar: enrollment.userId?.profilePic || null,
    },
    course: {
      title: enrollment.courseId?.title || 'Unknown Course',
      id: enrollment.courseId?._id,
    },
    amount: enrollment.courseId?.pricing?.amount || 0,
    currency: enrollment.courseId?.pricing?.currency || 'USD',
    timestamp: enrollment.createdAt,
  }));
};

/**
 * Get activity feed
 */
export const getActivityFeed = async (options: ActivityFeedOptions) => {
  const { limit, types } = options;
  
  const activities: any[] = [];

  // Fetch recent courses
  if (!types || types.includes('course')) {
    const recentCourses = await CourseModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('createdBy', 'name')
      .lean();

    activities.push(
      ...recentCourses.map((course: any) => ({
        id: `course_${course._id}`,
        type: 'course',
        action: 'created',
        user: {
          name: course.createdBy?.name || 'System',
          id: course.createdBy?._id,
        },
        target: {
          title: course.title,
          id: course._id,
        },
        timestamp: course.createdAt,
      }))
    );
  }

  // Fetch recent enrollments
  if (!types || types.includes('revenue')) {
    const recentEnrollments = await CourseEnrollmentModel.find()
      .sort({ createdAt: -1 })
      .limit(Math.ceil(limit / 2))
      .populate('userId', 'name')
      .populate('courseId', 'title')
      .lean();

    activities.push(
      ...recentEnrollments.map((enrollment: any) => ({
        id: `enrollment_${enrollment._id}`,
        type: 'revenue',
        action: 'enrolled',
        user: {
          name: enrollment.userId?.name || 'User',
          id: enrollment.userId?._id,
        },
        target: {
          title: enrollment.courseId?.title || 'Course',
          id: enrollment.courseId?._id,
        },
        timestamp: enrollment.createdAt,
      }))
    );
  }

  // Sort by timestamp and limit
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return activities.slice(0, limit);
};
