import { Router } from 'express';
import {
  createJobApplicationController,
  getAllJobApplicationsController,
  getJobApplicationByIdController,
  updateJobApplicationByIdController,
  deleteJobApplicationByIdController,
  exportJobApplicationsController,
} from '@/controllers/jobApplicationController';
import { validateSchema } from '@/middleware/validateSchema';
import { createJobApplicationSchema, updateJobApplicationSchema } from '@/entity-schema/jobApplication';
import passport from 'passport';

const router = Router();

router.post('/', validateSchema(createJobApplicationSchema), createJobApplicationController);
router.get('/export', exportJobApplicationsController);
router.get('/', passport.authenticate('jwt', {session: false}), getAllJobApplicationsController);
router.get('/:id', passport.authenticate('jwt', {session: false}), getJobApplicationByIdController);
router.put('/:id', passport.authenticate('jwt', {session: false}), validateSchema(updateJobApplicationSchema), updateJobApplicationByIdController);
router.delete('/:id', passport.authenticate('jwt', {session: false}), deleteJobApplicationByIdController);

export { router as JobApplicationRouter };
