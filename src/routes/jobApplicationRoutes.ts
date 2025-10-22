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
import { checkPermission } from '@/middleware/permissionMiddleware';

const router = Router();

router.post('/', validateSchema(createJobApplicationSchema), createJobApplicationController);
router.get('/export', exportJobApplicationsController);
router.get('/', passport.authenticate('jwt', {session: false}), checkPermission('JOB_APP_VIEW'), getAllJobApplicationsController);
router.get('/:id', passport.authenticate('jwt', {session: false}), checkPermission('JOB_APP_VIEW'), getJobApplicationByIdController);
router.put('/:id', passport.authenticate('jwt', {session: false}), checkPermission('JOB_APP_UPDATE'), validateSchema(updateJobApplicationSchema), updateJobApplicationByIdController);
router.delete('/:id', passport.authenticate('jwt', {session: false}), checkPermission('JOB_APP_DELETE'), deleteJobApplicationByIdController);

export { router as JobApplicationRouter };
