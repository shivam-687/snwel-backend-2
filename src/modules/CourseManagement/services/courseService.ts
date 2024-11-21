import { FilterQuery, PaginateOptions } from 'mongoose';
import { CourseModel, ICourse } from '../models/Course';
import { createSlug } from '@/utils/helpers';

export class CourseService {
  static async createCourse(courseData: Partial<ICourse>, userId: string): Promise<ICourse> {
    try {
      const slug = createSlug(courseData.title!);
      
      const course = new CourseModel({
        ...courseData,
        slug,
        createdBy: userId,
        updatedBy: userId
      });

      return await course.save();
    } catch (error) {
      throw error;
    }
  }

  static async updateCourse(courseId: string, courseData: Partial<ICourse>, userId: string): Promise<ICourse | null> {
    try {
      if (courseData.title) {
        courseData.slug = createSlug(courseData.title);
      }

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          ...courseData,
          updatedBy: userId
        },
        { new: true }
      );

      return course;
    } catch (error) {
      throw error;
    }
  }

  static async deleteCourse(courseId: string): Promise<boolean> {
    try {
      const result = await CourseModel.findByIdAndDelete(courseId);
      return !!result;
    } catch (error) {
      throw error;
    }
  }

  static async getCourseById(courseId: string): Promise<ICourse | null> {
    try {
      return await CourseModel.findById(courseId)
        .populate('category', 'name slug')
        .populate('instructor', 'name email');
    } catch (error) {
      throw error;
    }
  }

  static async getCourses(
    query: FilterQuery<ICourse> = {},
    options: PaginateOptions = { page: 1, limit: 10 }
  ) {
    try {
      return await CourseModel.paginate(query, {
        ...options,
        populate: [
          { path: 'category', select: 'name slug' },
          { path: 'instructor', select: 'name email' }
        ]
      });
    } catch (error) {
      throw error;
    }
  }

  static async publishCourse(courseId: string, publish: boolean): Promise<ICourse | null> {
    try {
      return await CourseModel.findByIdAndUpdate(
        courseId,
        { isPublished: publish },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  static async getPublishedCourses(
    query: FilterQuery<ICourse> = {},
    options: PaginateOptions = { page: 1, limit: 10 }
  ) {
    try {
      return await CourseModel.paginate(
        { ...query, isPublished: true, isActive: true },
        {
          ...options,
          populate: [
            { path: 'category', select: 'name slug' },
            { path: 'instructor', select: 'name email' }
          ]
        }
      );
    } catch (error) {
      throw error;
    }
  }
} 