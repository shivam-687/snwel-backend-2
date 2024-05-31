import express from 'express';
import AuthRouter from './authRoute';
import { getUserListController } from '@/controllers/userController';
import passport from 'passport';
import { createByAnonymous, createController, deleteController, getAllController, getByIdController, resendOtpController, updateController, verifyOtpController } from '@/controllers/courseEnrollmentController';
import { validateSchema } from '@/middleware/validateSchema';
import { createCourseEnrollment, createEnrollmentAnonymously } from '@/entity-schema/course-enrollment';
import { checkAlreadyApplied } from '@/middleware/checkAlreadyApplied';

const router = express.Router();


router.get('/', passport.authenticate('jwt', {session: false}), getAllController);
router.post('/', validateSchema(createCourseEnrollment), checkAlreadyApplied(), createController);
router.post('/anon', validateSchema(createEnrollmentAnonymously), createByAnonymous);
router.post('/verify-otp', verifyOtpController);
router.post('/resend-otp', resendOtpController);
router.get('/:id', passport.authenticate('jwt', {session: false}), getByIdController);
router.put('/:id',passport.authenticate('jwt', {session: false}), updateController);
router.delete('/:id', passport.authenticate('jwt', {session: false}), deleteController);


export { router as courseEnrollmentRouter };
