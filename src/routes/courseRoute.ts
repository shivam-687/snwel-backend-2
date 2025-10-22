import express from 'express';
import passport from 'passport';
import { checkPermission } from '@/middleware/permissionMiddleware';
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
router.post('/',passport.authenticate('jwt', {session: false}), checkPermission('COURSE_CREATE'), createCourseController);
router.get('/byId/:courseId', getCourseByIdController);
router.put('/partial-update/:courseId', passport.authenticate('jwt', {session: false}), checkPermission('COURSE_UPDATE'), partialUpdateCourseController);
router.put('/:courseId', passport.authenticate('jwt', {session: false}), checkPermission('COURSE_UPDATE'), updateCourseController);
router.delete('/:courseId', passport.authenticate('jwt', {session: false}), checkPermission('COURSE_DELETE'), deleteCourseController);
router.get('/:slug', getCourseBySlugController);


export { router as CourseRouter };
