import express from 'express';
import {  getAllCoursesController, getCourseByIdController, getCourseBySlugController } from '@/components/course/controllers/courseControllers';

const router = express.Router();


router.get('/', getAllCoursesController);
router.get('/byId/:courseId', getCourseByIdController);
router.get('/:slug', getCourseBySlugController);


export { router as CourseRouter };
