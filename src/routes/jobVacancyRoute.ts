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

const router = Router();

router.post('/', validateSchema(createJobVacancySchema), createJobVacancyController);
router.get('/', getAllJobVacanciesController);
router.get('/:idOrSlug', getJobVacancyController);
router.put('/:id', validateSchema(updateJobVacancySchema), updateJobVacancyByIdController);
router.delete('/:id', deleteJobVacancyByIdController);

export { router as JobVacancyRouter };
