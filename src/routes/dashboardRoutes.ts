import express from 'express';
import AuthRouter from './authRoute';
import passport from 'passport';
import { getCoursesByCategoryController, getYearlySalesDataController, getImportantEntitiesCountController, getPopularCoursesController, getTopRatedCoursesController, getTotalCoursesController, getTotalEnrolledUsersController, getTotalRevenueController, getTotalUsersController, getUpcomingWebinarsController, getUserEnrollmentsController } from '@/controllers/analyticsController';
import { checkPermission } from '@/middleware/permissionMiddleware';

const router = express.Router();

router.get('/count', passport.authenticate('jwt', {session: false}), checkPermission('ANALYTICS_VIEW'), getImportantEntitiesCountController);
router.get('/popular-courses', getPopularCoursesController);
router.get('/total-enrolled-users', passport.authenticate('jwt', {session: false}), checkPermission('ANALYTICS_VIEW'),  getTotalEnrolledUsersController);
router.get('/upcoming-webinars', getUpcomingWebinarsController);
router.get('/courses-by-category/:categoryId', passport.authenticate('jwt', {session: false}), checkPermission('ANALYTICS_VIEW'), getCoursesByCategoryController);
router.get('/total-revenue', passport.authenticate('jwt', {session: false}), checkPermission('ANALYTICS_VIEW'),  getTotalRevenueController);
router.get('/top-rated-courses', getTopRatedCoursesController);
router.get('/total-courses',passport.authenticate('jwt', {session: false}), checkPermission('ANALYTICS_VIEW'), getTotalCoursesController);
router.get('/total-users',passport.authenticate('jwt', {session: false}), checkPermission('ANALYTICS_VIEW'), getTotalUsersController);
router.get('/user-enrollments/:userId',passport.authenticate('jwt', {session: false}), checkPermission('ANALYTICS_VIEW'), getUserEnrollmentsController);
router.get('/yearly-sales', getYearlySalesDataController);




export { router as DashboardRoutes };
