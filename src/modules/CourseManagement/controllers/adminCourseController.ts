import { Request, Response } from 'express';
import { CourseService } from '../services/courseService';
import { CategoryService } from '../services/categoryService';
import { EnrollmentService } from '../services/enrollmentService';
import { catchAsync } from '@/utils/helpers/catchAsync';
import { successResponse, errorResponse } from '@/utils/helpers/appResponse';
import { extractListOptions } from '@/utils/helpers';

export class AdminCourseController {
  // Course Controllers
  static createCourse = catchAsync(async (req: Request, res: Response) => {
    const courseData = req.body;
    const userId = req.user!._id;
    const course = await CourseService.createCourse(courseData, userId);
    return successResponse(course, res, { message: 'Course created successfully' });
  });

  static getAllCourses = catchAsync(async (req: Request, res: Response) => {
    const options = extractListOptions(req);
    const courses = await CourseService.getCourses({}, options);
    return successResponse(courses, res, { message: 'Courses fetched successfully' });
  });

  static getCourseById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const course = await CourseService.getCourseById(id);
    
    if (!course) {
      return errorResponse('Course not found', res);
    }
    
    return successResponse(course, res, { message: 'Course fetched successfully' });
  });

  static updateCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user!._id;
    
    const course = await CourseService.updateCourse(id, updateData, userId);
    if (!course) {
      return errorResponse('Course not found', res);
    }
    
    return successResponse(course, res, { message: 'Course updated successfully' });
  });

  static deleteCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await CourseService.deleteCourse(id);
    return successResponse(null, res, { message: 'Course deleted successfully' });
  });

  static publishCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { publish } = req.body;
    
    const course = await CourseService.publishCourse(id, publish);
    if (!course) {
      return errorResponse('Course not found', res);
    }
    
    return successResponse(course, res, { 
      message: `Course ${publish ? 'published' : 'unpublished'} successfully` 
    });
  });

  // Category Controllers
  static createCategory = catchAsync(async (req: Request, res: Response) => {
    const categoryData = req.body;
    const category = await CategoryService.createCategory(categoryData);
    return successResponse(category, res, { message: 'Category created successfully' });
  });

  static getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const options = extractListOptions(req);
    const categories = await CategoryService.getCategories(options);
    return successResponse(categories, res, { message: 'Categories fetched successfully' });
  });

  static updateCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    
    const category = await CategoryService.updateCategory(id, updateData);
    if (!category) {
      return errorResponse('Category not found', res);
    }
    
    return successResponse(category, res, { message: 'Category updated successfully' });
  });

  static deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await CategoryService.deleteCategory(id);
    return successResponse(null, res, { message: 'Category deleted successfully' });
  });

  // Enrollment Controllers
  static getAllEnrollments = catchAsync(async (req: Request, res: Response) => {
    const options = extractListOptions(req);
    const enrollments = await EnrollmentService.getEnrollments(options);
    return successResponse(enrollments, res, { message: 'Enrollments fetched successfully' });
  });

  static updateEnrollmentStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const enrollment = await EnrollmentService.updateEnrollmentStatus(id, status);
    if (!enrollment) {
      return errorResponse('Enrollment not found', res);
    }
    
    return successResponse(enrollment, res, { message: 'Enrollment status updated successfully' });
  });
} 