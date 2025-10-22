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
import { WidgetRouter } from './widgetRoutes';
import { EnquiryRouter } from './enquiryRoute';
import { JobVacancyRouter } from './jobVacancyRoute';
import { JobCategoryRouter } from './jobCategoryRoutes';
import { MasterRouter } from './masterRoute';
import PaymentRouter from '@/components/payment/paymentRoutes';
import { JobApplicationRouter } from './jobApplicationRoutes';
import { OtpRouter } from './otpRoutes';
import { GalleryRouter } from './gallerRoutes';
import { IntegrationRouter } from './integration.routes';
import { SnwelEnquiryRouter } from './snwelEnquiry';
import { BlogRouter } from '@/components/blog/admin-routes';
import { BlogCategoryRouter } from '@/components/blog-category/blog-category-routes';
import { AdminUserRouter, ClientUserRouter } from '@/modules/UserManagement';
import { RoleRouter } from '@/modules/UserManagement/routes/roleRoutes';
import { AdminCourseRouter } from './adminCourseRoutes';
import { AdminDashboardRouter } from './admin/dashboardRoutes';
import { AdminPermissionsRouter } from './admin/permissionsRoutes';

const router = express.Router();

router.get('/', helloController)
router.use('/auth', AuthRouter);
router.use('/user', UserRouter);
router.use('/course', CourseRouter);
router.use('/admin/course', AdminCourseRouter);
router.use('/course-category', CourseCategoryRouter);
router.use('/file', FileRouter);
router.use('/webinar', WebinarRouter)
router.use('/course-enroll', courseEnrollmentRouter);
router.use("/settings", SettingRouter)
router.use("/analytics", DashboardRoutes);
router.use("/widgets", WidgetRouter);
router.use("/enquiries", EnquiryRouter);
router.use("/jobvacancies", JobVacancyRouter);
router.use("/jobcategories", JobCategoryRouter);
router.use("/master", MasterRouter);
router.use("/payments", PaymentRouter)
router.use("/job-application", JobApplicationRouter)
router.use("/otp", OtpRouter)
router.use("/gallery", GalleryRouter);
router.use("/integrations", IntegrationRouter);
router.use("/snwel-enquiry", SnwelEnquiryRouter);
router.use(BlogRouter)
router.use(BlogCategoryRouter)
router.use('/admin/users', AdminUserRouter);
router.use('/users', ClientUserRouter);
router.use('/roles', RoleRouter);
router.use('/admin/dashboard', AdminDashboardRouter);
router.use('/admin/permissions', AdminPermissionsRouter);

export { router as indexRoute };
