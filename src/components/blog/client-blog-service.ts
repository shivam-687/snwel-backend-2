// src/services/blogService.ts

import BlogModel, { IBlog as Blog } from './blog-model';
import { ListOptions } from '@/types/custom';
import { convertSortOrder } from '@/utils/helpers';
import { Types } from 'mongoose';

// Function to get a published blog by ID
export async function getBlogById(blogId: string): Promise<Blog | null> {
  try {
    const query: any = Types.ObjectId.isValid(blogId)
      ? { _id: blogId }
      : { slug: blogId };

    // Enforce published status
    query.published = true;

    const blog = await BlogModel.findOne(query).populate('author', '_id profilePic name email').lean();
    return blog;
  } catch (error: any) {
    throw error;
  }
}

// Function to get all published blogs with pagination
export const getAllBlogs = async (options: ListOptions): Promise<any> => {
  try {
    const { limit = 10, page = 1, search, sort, startDate, endDate } = options;
    const query: any = {
      published: true // Enforce published status
    };

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

