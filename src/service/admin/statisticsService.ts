import { CourseModel } from '@/models/CourseModel';
import CourseEnrollmentModel from '@/models/CourseEnrollment';
import { UserModel } from '@/models/User';
import { startOfMonth, subMonths } from 'date-fns';

// Check if models exist, if not provide fallback
let JobVacancyModel: any;
let JobApplicationModel: any;
let BlogModel: any;

try {
  JobVacancyModel = require('@/models/JobVacancy').JobVacancyModel;
} catch (e) {
  JobVacancyModel = null;
}

try {
  JobApplicationModel = require('@/models/JobApplication').JobApplicationModel;
} catch (e) {
  JobApplicationModel = null;
}

try {
  BlogModel = require('@/models/Blog').BlogModel;
} catch (e) {
  BlogModel = null;
}

/**
 * Get course statistics
 */
export const getCourseStatistics = async () => {
  const totalCourses = await CourseModel.countDocuments();
  const publishedCourses = await CourseModel.countDocuments({ status: 'PUBLISHED' });
  const draftCourses = await CourseModel.countDocuments({ status: 'SAVED' });
  const totalEnrollments = await CourseEnrollmentModel.countDocuments();

  // Calculate average rating (placeholder - implement based on your review system)
  const averageRating = 4.5; // TODO: Implement based on actual review model

  // Calculate completion rate (placeholder)
  const completedEnrollments = await CourseEnrollmentModel.countDocuments({ status: 'completed' });
  const completionRate = totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;

  return {
    totalCourses,
    publishedCourses,
    draftCourses,
    totalEnrollments,
    averageRating,
    completionRate: Number(completionRate.toFixed(2)),
  };
};

/**
 * Get user statistics
 */
export const getUserStatistics = async () => {
  const now = new Date();
  const startOfThisMonth = startOfMonth(now);

  const totalUsers = await UserModel.countDocuments();
  const activeUsers = await UserModel.countDocuments({ isActive: true });
  const newThisMonth = await UserModel.countDocuments({
    createdAt: { $gte: startOfThisMonth },
  });

  // Count by role
  const roleAggregation = await UserModel.aggregate([
    {
      $lookup: {
        from: 'roles',
        localField: 'roles',
        foreignField: '_id',
        as: 'roleDetails',
      },
    },
    { $unwind: { path: '$roleDetails', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: '$roleDetails.name',
        count: { $sum: 1 },
      },
    },
  ]);

  const byRole: Record<string, number> = {};
  roleAggregation.forEach((item) => {
    const roleName = item._id || 'No Role';
    byRole[roleName.toLowerCase()] = item.count;
  });

  return {
    totalUsers,
    activeUsers,
    newThisMonth,
    byRole,
  };
};

/**
 * Get job statistics
 */
export const getJobStatistics = async () => {
  if (!JobVacancyModel || !JobApplicationModel) {
    return {
      activeJobs: 0,
      totalApplications: 0,
      pendingReview: 0,
      avgApplicationsPerJob: 0,
    };
  }

  const activeJobs = await JobVacancyModel.countDocuments({ status: 'ACTIVE' });
  const totalApplications = await JobApplicationModel.countDocuments();
  const pendingReview = await JobApplicationModel.countDocuments({ status: 'PENDING' });
  const avgApplicationsPerJob = activeJobs > 0 ? totalApplications / activeJobs : 0;

  return {
    activeJobs,
    totalApplications,
    pendingReview,
    avgApplicationsPerJob: Number(avgApplicationsPerJob.toFixed(1)),
  };
};

/**
 * Get blog statistics
 */
export const getBlogStatistics = async () => {
  if (!BlogModel) {
    return {
      totalBlogs: 0,
      published: 0,
      drafts: 0,
      totalViews: 0,
      avgViewsPerPost: 0,
    };
  }

  const totalBlogs = await BlogModel.countDocuments();
  const published = await BlogModel.countDocuments({ status: 'PUBLISHED' });
  const drafts = await BlogModel.countDocuments({ status: 'DRAFT' });

  // If your blog model has a views field, aggregate it
  const viewsAggregation = await BlogModel.aggregate([
    {
      $group: {
        _id: null,
        totalViews: { $sum: '$views' },
      },
    },
  ]);

  const totalViews = viewsAggregation[0]?.totalViews || 0;
  const avgViewsPerPost = totalBlogs > 0 ? totalViews / totalBlogs : 0;

  return {
    totalBlogs,
    published,
    drafts,
    totalViews,
    avgViewsPerPost: Math.round(avgViewsPerPost),
  };
};
