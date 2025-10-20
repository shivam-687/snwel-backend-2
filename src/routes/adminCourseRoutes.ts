import express from 'express';
import passport from 'passport';
import {
  createCourseController,
  deleteCourseController,
  getAllCoursesController,
  getCourseByIdController,
  getCourseBySlugController,
  partialUpdateCourseController,
  updateCourseController,
} from '@/admin/controllers/courseController';

const router = express.Router();

// Protect all admin endpoints with JWT to avoid exposing drafts
router.get('/', passport.authenticate('jwt', { session: false }), getAllCoursesController);
router.post('/', passport.authenticate('jwt', { session: false }), createCourseController);
router.get('/byId/:courseId', passport.authenticate('jwt', { session: false }), getCourseByIdController);
router.put('/partial-update/:courseId', passport.authenticate('jwt', { session: false }), partialUpdateCourseController);
router.put('/:courseId', passport.authenticate('jwt', { session: false }), updateCourseController);
router.delete('/:courseId', passport.authenticate('jwt', { session: false }), deleteCourseController);
router.get('/:slug', passport.authenticate('jwt', { session: false }), getCourseBySlugController);

export { router as AdminCourseRouter };
