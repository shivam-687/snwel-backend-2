import { Router } from 'express';
import {
  createJobVacancyController,
  getAllJobVacanciesController,
  getJobVacancyController,
  updateJobVacancyByIdController,
  deleteJobVacancyByIdController,
} from '@/controllers/jobVacancyController';
import { validateSchema } from '@/middleware/validateSchema';
import { createJobVacancySchema, updateJobVacancySchema } from '@/entity-schema/jobVacancy';
import passport from 'passport';
import { checkPermission } from '@/middleware/permissionMiddleware';
import { getJobStatistics } from '@/controllers/admin/statisticsController';

const router = Router();

// Statistics endpoint (admin only)
router.get('/statistics', passport.authenticate('jwt', { session: false }), checkPermission('JOB_VIEW'), getJobStatistics);

// Public list and get endpoints
router.get('/', getAllJobVacanciesController);
router.get('/:idOrSlug', getJobVacancyController);

// Admin endpoints
router.post('/', passport.authenticate('jwt', { session: false }), checkPermission('JOB_CREATE'), validateSchema(createJobVacancySchema), createJobVacancyController);
router.put('/:id', passport.authenticate('jwt', { session: false }), checkPermission('JOB_UPDATE'), validateSchema(updateJobVacancySchema), updateJobVacancyByIdController);
router.delete('/:id', passport.authenticate('jwt', { session: false }), checkPermission('JOB_DELETE'), deleteJobVacancyByIdController);

export { router as JobVacancyRouter };
