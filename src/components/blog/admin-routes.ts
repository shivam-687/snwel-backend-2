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

const router = Router();

// Route to create a new blog
router.post('/blogs',passport.authenticate('jwt', {session: false}), createBlogController);

// Route to get a blog by ID
router.get('/blogs/:id', getBlogByIdController);

// Route to update a blog by ID
router.put('/blogs/:id', passport.authenticate('jwt', {session: false}), updateBlogByIdController);

// Route to soft delete a blog by ID
router.delete('/blogs/:id', passport.authenticate('jwt', {session: false}), deleteBlogByIdController);

// Route to get all blogs with optional filters
router.get('/blogs', getAllBlogsController);

// Route to hard delete all soft-deleted blogs
router.delete('/blogs/hard-delete', passport.authenticate('jwt', {session: false}), hardDeleteAllSoftDeletedBlogsController);



router.get("/guest/blogs", getBlogsController);
router.get("/guest/blogs/:id", getBlogByIdController);

export {router as BlogRouter};
