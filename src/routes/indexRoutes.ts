
import express from 'express';
import { helloController } from '../controllers/helloController';
import AuthRouter from './authRoute';
import { UserRouter } from './userRoute';
import { CourseRouter } from './courseRoute';
import { CourseCategoryRouter } from './courseCategory.routes';
import { FileRouter } from './fileRoute';
import { WebinarRouter } from './webinarRoute';
import { courseEnrollmentRouter } from './courseEnrollmentRouter';
import { SettingRouter } from './setting-route';
import { DashboardRoutes } from './dashboardRoutes';

const router = express.Router();

router.get('/', helloController)
router.use('/auth', AuthRouter);
router.use('/user', UserRouter);
router.use('/course', CourseRouter);
router.use('/course-category', CourseCategoryRouter)
router.use('/file', FileRouter);
router.use('/webinar', WebinarRouter)
router.use('/course-enroll', courseEnrollmentRouter);
router.use("/settings", SettingRouter)
router.use("/analytics", DashboardRoutes)


export { router as indexRoute };
