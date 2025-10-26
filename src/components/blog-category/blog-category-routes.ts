import { Router } from 'express';
import {
    createBlogCategoryController,
    getBlogCategoryByIdController,
    updateBlogCategoryByIdController,
    deleteBlogCategoryByIdController,
    getAllBlogCategoriesController,
    hardDeleteAllSoftDeletedBlogCategoriesController,
} from './blog-category-controller';
import passport from '@/config/passport-config';
import { checkPermission } from '@/middleware/permissionMiddleware';

const router = Router();

// Public routes
router.get('/categories', getAllBlogCategoriesController);
router.get('/categories/:id', getBlogCategoryByIdController);

// Admin routes (require authentication and permissions)
router.post('/categories', passport.authenticate('jwt', { session: false }), checkPermission('BLOG_CATEGORY_CREATE'), createBlogCategoryController);
router.put('/categories/:id', passport.authenticate('jwt', { session: false }), checkPermission('BLOG_CATEGORY_UPDATE'), updateBlogCategoryByIdController);
router.delete('/categories/:id', passport.authenticate('jwt', { session: false }), checkPermission('BLOG_CATEGORY_DELETE'), deleteBlogCategoryByIdController);
router.delete('/categories/hard-delete', passport.authenticate('jwt', { session: false }), checkPermission('BLOG_CATEGORY_DELETE'), hardDeleteAllSoftDeletedBlogCategoriesController);

export { router as BlogCategoryRouter };
