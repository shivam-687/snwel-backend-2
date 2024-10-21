// src/services/blogService.ts

import BlogModel, { IBlog as Blog } from './blog-model';
import { ListOptions } from '@/types/custom';
import { convertSortOrder, getPaginationParams } from '@/utils/helpers';
import { Types } from 'mongoose';
import { Parser } from 'json2csv';

// Function to create a new blog
export async function createBlog(data: Blog): Promise<Blog> {
  try {
    const blog = await BlogModel.create(data);
    return blog.toObject();
  } catch (error: any) {
    console.error(`Failed to create blog: ${error.message}`, error);
    throw new Error(`Failed to create blog: ${error.message}`);
  }
}

// Function to get a blog by ID
export async function getBlogById(blogId: string): Promise<Blog | null> {
  try {
    const query = Types.ObjectId.isValid(blogId)
      ? { _id: blogId }
      : { slug: blogId };
    const blog = await BlogModel.findOne(query).populate( 'author', '_id profilePic name email').lean();
    return blog;
  } catch (error: any) {
    throw error;
  }
}

// Function to update a blog by ID
export async function updateBlogById(blogId: string, updateData: Partial<Blog>): Promise<Blog | null> {
  try {
    const blog = await BlogModel.findByIdAndUpdate(blogId, updateData, { new: true });
    return blog;
  } catch (error: any) {
    throw new Error(`Failed to update blog: ${error.message}`);
  }
}

// Function to delete a blog by ID
export async function deleteBlogById(blogId: string): Promise<void> {
  try {
    await BlogModel.findByIdAndDelete(blogId);
  } catch (error: any) {
    throw new Error(`Failed to delete blog: ${error.message}`);
  }
}

// Function to get all blogs with pagination
export const getAllBlogs = async (options: ListOptions): Promise<any> => {
  try {
    const { limit = 10, page = 1, search, filter, sort, startDate, endDate } = options;
    const query: any = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ title: searchRegex }, { content: searchRegex }, { author: searchRegex }];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const blogs = await BlogModel.paginate(
      query,
      {
        page,
        limit,
        sort: sort ? convertSortOrder(sort) : { createdAt: -1 },
        populate: [
          {
            path: 'category',
            select: "_id name slug"
          }
        ]
      }
    );

    return blogs;
  } catch (error: any) {
    throw new Error(`Error retrieving blogs: ${error.message}`);
  }
};

// Function to export blogs to CSV
export const exportBlogs = async (options: ListOptions): Promise<string> => {
  try {
    const blogs = await getAllBlogs(options);
    const blogData = blogs.docs; // Extract the documents from the paginated result

    // Convert the data to CSV format
    const parser = new Parser();
    const csv = parser.parse(blogData);

    return csv; // You can return the CSV string or save it to a file
  } catch (error: any) {
    throw new Error(`Error exporting blogs: ${error.message}`);
  }
};

// Function to hard delete all soft-deleted blogs
