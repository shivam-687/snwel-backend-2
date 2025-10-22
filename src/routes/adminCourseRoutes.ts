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
  updateCourseController,
} from '@/admin/controllers/courseController';
import { getCourseStatistics } from '@/controllers/admin/statisticsController';

const router = express.Router();

// Protect all admin endpoints with JWT to avoid exposing drafts
router.get('/statistics', passport.authenticate('jwt', { session: false }), checkPermission('COURSE_VIEW'), getCourseStatistics);
router.get('/', passport.authenticate('jwt', { session: false }), checkPermission('COURSE_VIEW'), getAllCoursesController);
router.post('/', passport.authenticate('jwt', { session: false }), checkPermission('COURSE_CREATE'), createCourseController);
router.get('/byId/:courseId', passport.authenticate('jwt', { session: false }), checkPermission('COURSE_VIEW'), getCourseByIdController);
router.put('/partial-update/:courseId', passport.authenticate('jwt', { session: false }), checkPermission('COURSE_UPDATE'), partialUpdateCourseController);
router.put('/:courseId', passport.authenticate('jwt', { session: false }), checkPermission('COURSE_UPDATE'), updateCourseController);
router.delete('/:courseId', passport.authenticate('jwt', { session: false }), checkPermission('COURSE_DELETE'), deleteCourseController);
router.get('/:slug', passport.authenticate('jwt', { session: false }), checkPermission('COURSE_VIEW'), getCourseBySlugController);

export { router as AdminCourseRouter };
