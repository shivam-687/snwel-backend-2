import express from 'express';
import AuthRouter from './authRoute';
import { getUserListController } from '@/controllers/userController';
import passport from 'passport';
import { createCourseController, deleteCourseController, getAllCoursesController, getCourseByIdController, getCourseBySlugController, updateCourseController } from '@/controllers/courseController';

const router = express.Router();


router.get('/', passport.authenticate('jwt', {session: false}), getAllCoursesController);
router.post('/', createCourseController);
router.get('/byId/:courseId', getCourseByIdController);
router.put('/:courseId', updateCourseController);
router.delete('/:courseId', deleteCourseController);
router.get('/:slug', getCourseBySlugController);


export { router as CourseRouter };
