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

const router = Router();

// Route to create a new blog category
router.post('/categories', passport.authenticate('jwt', { session: false }), createBlogCategoryController);

// Route to get a blog category by ID or slug
router.get('/categories/:id', getBlogCategoryByIdController);

// Route to update a blog category by ID
router.put('/categories/:id', passport.authenticate('jwt', { session: false }), updateBlogCategoryByIdController);

// Route to soft delete a blog category by ID
router.delete('/categories/:id', passport.authenticate('jwt', { session: false }), deleteBlogCategoryByIdController);

// Route to get all blog categories with optional filters
router.get('/categories', getAllBlogCategoriesController);

// Route to hard delete all soft-deleted blog categories
router.delete('/categories/hard-delete', passport.authenticate('jwt', { session: false }), hardDeleteAllSoftDeletedBlogCategoriesController);

export { router as BlogCategoryRouter };
