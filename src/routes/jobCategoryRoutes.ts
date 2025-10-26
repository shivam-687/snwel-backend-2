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
import passport from 'passport';
import { checkPermission } from '@/middleware/permissionMiddleware';

const router = Router();

// Public routes
router.get('/', getAllJobCategoriesController);
router.get('/:id', getJobCategoryByIdController);

// Admin routes (require authentication and permissions)
router.post('/', passport.authenticate('jwt', { session: false }), checkPermission('JOB_CATEGORY_CREATE'), validateSchema(createJobCategorySchema), createJobCategoryController);
router.put('/:id', passport.authenticate('jwt', { session: false }), checkPermission('JOB_CATEGORY_UPDATE'), validateSchema(updateJobCategorySchema), updateJobCategoryByIdController);
router.delete('/:id', passport.authenticate('jwt', { session: false }), checkPermission('JOB_CATEGORY_DELETE'), deleteJobCategoryByIdController);

export { router as JobCategoryRouter };
