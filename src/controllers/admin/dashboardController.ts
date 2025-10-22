import { Request, Response } from 'express';
import { catchAsync } from '@/utils/helpers/catchAsync';
import { successResponse } from '@/utils/helpers/appResponse';
import * as dashboardService from '@/service/admin/dashboardService';

/**
 * GET /api/admin/dashboard/stats
 * Get overview statistics for dashboard cards
 */
export const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await dashboardService.getDashboardStats();
  successResponse(stats, res, { message: 'Dashboard statistics fetched successfully' });
});

/**
 * GET /api/admin/dashboard/revenue-trend
 * Get monthly revenue data for charts
 */
export const getRevenueTrend = catchAsync(async (req: Request, res: Response) => {
  const { period, startDate, endDate } = req.query;
  const trend = await dashboardService.getRevenueTrend({
    period: period as string,
    startDate: startDate as string,
    endDate: endDate as string,
  });
  successResponse(trend, res, { message: 'Revenue trend fetched successfully' });
});

/**
 * GET /api/admin/dashboard/top-courses
 * Get best-selling courses data
 */
export const getTopCourses = catchAsync(async (req: Request, res: Response) => {
  const { limit = 5, period = 'month' } = req.query;
  const courses = await dashboardService.getTopPerformingCourses({
    limit: Number(limit),
    period: period as string,
  });
  successResponse({ courses }, res, { message: 'Top performing courses fetched successfully' });
});

/**
 * GET /api/admin/dashboard/recent-enrollments
 * Get latest course purchases
 */
export const getRecentEnrollments = catchAsync(async (req: Request, res: Response) => {
  const { limit = 10 } = req.query;
  const enrollments = await dashboardService.getRecentEnrollments(Number(limit));
  successResponse({ enrollments }, res, { message: 'Recent enrollments fetched successfully' });
});

/**
 * GET /api/admin/dashboard/activity-feed
 * Get recent platform activities
 */
export const getActivityFeed = catchAsync(async (req: Request, res: Response) => {
  const { limit = 10, types } = req.query;
  const typesArray = types ? (types as string).split(',') : undefined;
  const activities = await dashboardService.getActivityFeed({
    limit: Number(limit),
    types: typesArray,
  });
  successResponse({ activities }, res, { message: 'Activity feed fetched successfully' });
});
