import express from 'express';
import { getAllCategories, createCategory, getCategoryById, updateCategoryById, deleteCategoryById, attachParent } from '../controllers/courseCategoryController';
import passport from 'passport';
import { checkPermission } from '@/middleware/permissionMiddleware';
// import { validateSchema } from '@/middleware/validateSchema';

const router = express.Router();

// Public routes - categories can be viewed by anyone
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Admin routes (require authentication and permissions)
router.post('/', passport.authenticate('jwt', { session: false }), checkPermission('CATEGORY_MANAGE'), createCategory);
router.put('/:id', passport.authenticate('jwt', { session: false }), checkPermission('CATEGORY_MANAGE'), updateCategoryById);
router.delete('/:id', passport.authenticate('jwt', { session: false }), checkPermission('CATEGORY_MANAGE'), deleteCategoryById);
router.patch('/attach', passport.authenticate('jwt', { session: false }), checkPermission('CATEGORY_MANAGE'), attachParent);

export  {router as CourseCategoryRouter};
