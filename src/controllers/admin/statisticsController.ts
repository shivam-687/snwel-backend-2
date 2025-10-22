import { Request, Response } from 'express';
import { catchAsync } from '@/utils/helpers/catchAsync';
import { successResponse } from '@/utils/helpers/appResponse';
import * as statisticsService from '@/service/admin/statisticsService';

/**
 * GET /api/admin/course/statistics
 * Get aggregated course metrics
 */
export const getCourseStatistics = catchAsync(async (req: Request, res: Response) => {
  const stats = await statisticsService.getCourseStatistics();
  successResponse(stats, res, { message: 'Course statistics fetched successfully' });
});

/**
 * GET /api/admin/users/statistics
 * Get user metrics
 */
export const getUserStatistics = catchAsync(async (req: Request, res: Response) => {
  const stats = await statisticsService.getUserStatistics();
  successResponse(stats, res, { message: 'User statistics fetched successfully' });
});

/**
 * GET /api/admin/jobs/statistics
 * Get job metrics
 */
export const getJobStatistics = catchAsync(async (req: Request, res: Response) => {
  const stats = await statisticsService.getJobStatistics();
  successResponse(stats, res, { message: 'Job statistics fetched successfully' });
});

/**
 * GET /api/admin/blogs/statistics
 * Get blog metrics
 */
export const getBlogStatistics = catchAsync(async (req: Request, res: Response) => {
  const stats = await statisticsService.getBlogStatistics();
  successResponse(stats, res, { message: 'Blog statistics fetched successfully' });
});
