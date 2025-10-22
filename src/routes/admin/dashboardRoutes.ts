import { Router } from 'express';
import passport from 'passport';
import { checkPermission } from '@/middleware/permissionMiddleware';
import * as dashboardController from '@/controllers/admin/dashboardController';

const router = Router();

// All dashboard endpoints require authentication and ANALYTICS_VIEW permission
router.use(passport.authenticate('jwt', { session: false }));
router.use(checkPermission('ANALYTICS_VIEW'));

// Dashboard statistics endpoints
router.get('/stats', dashboardController.getDashboardStats);
router.get('/revenue-trend', dashboardController.getRevenueTrend);
router.get('/top-courses', dashboardController.getTopCourses);
router.get('/recent-enrollments', dashboardController.getRecentEnrollments);
router.get('/activity-feed', dashboardController.getActivityFeed);

export { router as AdminDashboardRouter };
