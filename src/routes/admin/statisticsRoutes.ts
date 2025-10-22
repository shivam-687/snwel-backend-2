import { Router } from 'express';
import passport from 'passport';
import { checkPermission } from '@/middleware/permissionMiddleware';
import * as statisticsController from '@/controllers/admin/statisticsController';

const router = Router();

// All statistics endpoints require authentication
router.use(passport.authenticate('jwt', { session: false }));

// Course statistics
router.get('/courses', checkPermission('COURSE_VIEW'), statisticsController.getCourseStatistics);

// User statistics
router.get('/users', checkPermission('USER_VIEW'), statisticsController.getUserStatistics);

// Job statistics
router.get('/jobs', checkPermission('JOB_VIEW'), statisticsController.getJobStatistics);

// Blog statistics
router.get('/blogs', checkPermission('BLOG_VIEW'), statisticsController.getBlogStatistics);

export { router as AdminStatisticsRouter };
