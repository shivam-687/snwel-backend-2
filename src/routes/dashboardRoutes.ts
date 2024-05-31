import express from 'express';
import AuthRouter from './authRoute';
import passport from 'passport';
import { getCoursesByCategoryController, getYearlySalesDataController, getImportantEntitiesCountController, getPopularCoursesController, getTopRatedCoursesController, getTotalCoursesController, getTotalEnrolledUsersController, getTotalRevenueController, getTotalUsersController, getUpcomingWebinarsController, getUserEnrollmentsController } from '@/controllers/analyticsController';

const router = express.Router();

router.get('/count', passport.authenticate('jwt', {session: false}), getImportantEntitiesCountController);
router.get('/popular-courses', getPopularCoursesController);
router.get('/total-enrolled-users', passport.authenticate('jwt', {session: false}),  getTotalEnrolledUsersController);
router.get('/upcoming-webinars', getUpcomingWebinarsController);
router.get('/courses-by-category/:categoryId', passport.authenticate('jwt', {session: false}), getCoursesByCategoryController);
router.get('/total-revenue', passport.authenticate('jwt', {session: false}),  getTotalRevenueController);
router.get('/top-rated-courses', getTopRatedCoursesController);
router.get('/total-courses',passport.authenticate('jwt', {session: false}), getTotalCoursesController);
router.get('/total-users',passport.authenticate('jwt', {session: false}), getTotalUsersController);
router.get('/user-enrollments/:userId',passport.authenticate('jwt', {session: false}), getUserEnrollmentsController);
router.get('/yearly-sales', getYearlySalesDataController);




export { router as DashboardRoutes };
