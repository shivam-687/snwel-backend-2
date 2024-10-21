import { Request, Response } from 'express';
import {
    adminCreateBlog,
    adminGetBlogById,
    adminUpdateBlogById,
    adminDeleteBlogById,
    adminGetAllBlogs,
    hardDeleteSoftDeletedBlogs,
} from './admin-blog-service';
import { successResponse, errorResponseFromError } from '@/utils/helpers/appResponse';
import { catchAsync } from '@/utils/helpers/catchAsync';

// Controller function to create a new blog
export async function createBlogController(req: Request, res: Response): Promise<void> {
  try {
    const blogData = req.body; // Assuming blog data is sent in the request body
    const newBlog = await adminCreateBlog(blogData);
    successResponse(newBlog, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to get a blog by ID
export async function getBlogByIdController(req: Request, res: Response): Promise<void> {
  try {
    const blogId = req.params.id;
    const blog = await adminGetBlogById(blogId);
    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }
    successResponse(blog, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to update a blog by ID
export async function updateBlogByIdController(req: Request, res: Response): Promise<void> {
  try {
    const blogId = req.params.id;
    const updateData = req.body;
    const updatedBlog = await adminUpdateBlogById(blogId, updateData);
    if (!updatedBlog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }
    successResponse(updatedBlog, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to soft delete a blog by ID
export async function deleteBlogByIdController(req: Request, res: Response): Promise<void> {
  try {
    const blogId = req.params.id;
    await adminDeleteBlogById(blogId);
    successResponse({ message: 'Blog deleted successfully' }, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to get all blogs with pagination
export const getAllBlogsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const options = req.query; // Assuming options are passed as query params
  const blogs = await adminGetAllBlogs(options);
  return successResponse(blogs, res, { message: "Blogs fetched successfully!" });
});

// Controller function to hard delete all soft deleted blogs
export const hardDeleteAllSoftDeletedBlogsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  await hardDeleteSoftDeletedBlogs();
  return successResponse({ message: "All soft-deleted blogs have been permanently deleted!" }, res);
});
