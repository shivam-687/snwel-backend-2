import { Router } from 'express';
import {
    getAllBlogsController,
    getBlogByIdController
} from './client-blog-controller';

const router = Router();

// Route to get all published blogs
router.get('/guest/blogs', getAllBlogsController);

// Route to get a published blog by ID
router.get('/guest/blogs/:id', getBlogByIdController);

export { router as ClientBlogRouter };
