import { Router } from 'express';
import {
  createJobCategoryController,
  getAllJobCategoriesController,
  getJobCategoryByIdController,
  updateJobCategoryByIdController,
  deleteJobCategoryByIdController,
} from '@/controllers/jobCategoryController';
import { validateSchema } from '@/middleware/validateSchema';
import { createJobCategorySchema, updateJobCategorySchema } from '@/entity-schema/job-category';

const router = Router();

router.post('/', validateSchema(createJobCategorySchema), createJobCategoryController);
router.get('/', getAllJobCategoriesController);
router.get('/:id', getJobCategoryByIdController);
router.put('/:id', validateSchema(updateJobCategorySchema), updateJobCategoryByIdController);
router.delete('/:id', deleteJobCategoryByIdController);

export { router as JobCategoryRouter };
