import express from 'express';
import passport from 'passport';
import { 
    createCourseController, 
    deleteCourseController, 
    getAllCoursesController, 
    getCourseByIdController, 
    getCourseBySlugController, 
    partialUpdateCourseController, 
    updateCourseController 
} from '@/controllers/courseController';

const router = express.Router();


router.get('/', getAllCoursesController);
router.post('/',passport.authenticate('jwt', {session: false}), createCourseController);
router.get('/byId/:courseId', getCourseByIdController);
router.put('/partial-update/:courseId', passport.authenticate('jwt', {session: false}), partialUpdateCourseController);
router.put('/:courseId', passport.authenticate('jwt', {session: false}), updateCourseController);
router.delete('/:courseId', passport.authenticate('jwt', {session: false}), deleteCourseController);
router.get('/:slug', getCourseBySlugController);


export { router as CourseRouter };
