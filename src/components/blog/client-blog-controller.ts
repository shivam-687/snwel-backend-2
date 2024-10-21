import { Request, Response } from 'express';
import {
getBlogById,
getAllBlogs
} from './client-blog-service'
import { successResponse, errorResponseFromError } from '@/utils/helpers/appResponse';
import { catchAsync } from '@/utils/helpers/catchAsync';


// Controller function to get a blog by ID
export async function getBlogByIdController(req: Request, res: Response): Promise<void> {
  try {
    const blogId = req.params.id;
    const blog = await getBlogById(blogId);
    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }
    successResponse(blog, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}



// Controller function to get all blogs with pagination
export const getAllBlogsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const options = req.query; // Assuming options are passed as query params
  const blogs = await getAllBlogs(options);
  return successResponse(blogs, res, { message: "Blogs fetched successfully!" });
});

