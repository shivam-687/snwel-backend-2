import { Router } from 'express';
import {
  createBlogController,
  getBlogByIdController,
  updateBlogByIdController,
  deleteBlogByIdController,
  getAllBlogsController,
  hardDeleteAllSoftDeletedBlogsController,
} from './admin-blog-controller';
import passport from '@/config/passport-config';
import { getAllBlogsController as getBlogsController, getBlogByIdController as getBlogById } from './client-blog-controller';
import { checkPermission } from '@/middleware/permissionMiddleware';
import { getBlogStatistics } from '@/controllers/admin/statisticsController';

const router = Router();

// Route to get blog statistics (must be before /blogs/:id)
router.get('/blogs/statistics', passport.authenticate('jwt', {session: false}), checkPermission('BLOG_VIEW'), getBlogStatistics);

// Route to create a new blog
router.post('/blogs', passport.authenticate('jwt', {session: false}), checkPermission('BLOG_CREATE'), createBlogController);

// Route to get all blogs with optional filters (admin)
router.get('/blogs', passport.authenticate('jwt', {session: false}), checkPermission('BLOG_VIEW'), getAllBlogsController);

// Route to get a blog by ID
router.get('/blogs/:id', passport.authenticate('jwt', {session: false}), checkPermission('BLOG_VIEW'), getBlogByIdController);

// Route to update a blog by ID
router.put('/blogs/:id', passport.authenticate('jwt', {session: false}), checkPermission('BLOG_UPDATE'), updateBlogByIdController);

// Route to soft delete a blog by ID
router.delete('/blogs/:id', passport.authenticate('jwt', {session: false}), checkPermission('BLOG_DELETE'), deleteBlogByIdController);

// Route to hard delete all soft-deleted blogs
router.delete('/blogs/hard-delete', passport.authenticate('jwt', {session: false}), checkPermission('BLOG_DELETE'), hardDeleteAllSoftDeletedBlogsController);



router.get("/guest/blogs", getBlogsController);
router.get("/guest/blogs/:id", getBlogByIdController);

export {router as BlogRouter};
