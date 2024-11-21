import { Request, Response } from 'express';
import { CourseService } from '../services/courseService';
import { CategoryService } from '../services/categoryService';
import { EnrollmentService } from '../services/enrollmentService';
import { catchAsync } from '@/utils/helpers/catchAsync';
import { successResponse, errorResponse } from '@/utils/helpers/appResponse';
import { extractListOptions } from '@/utils/helpers';

// Define the User type
interface User {
  _id: string;
  name: string;
  email: string;
  authenticationToken?: string | null;
}

// Define authenticated request type
interface AuthRequest extends Request {
  user: User;  // Note: not optional with strict mode
}

export class ClientCourseController {
  static getPublishedCourses = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, filter } = extractListOptions(req);
    const courses = await CourseService.getPublishedCourses(filter, { page, limit });
    return successResponse(courses, res, { message: 'Courses fetched successfully' });
  });

  static getCourseDetails = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const course = await CourseService.getCourseById(id);
    
    if (!course || !course.isPublished) {
      return errorResponse('Course not found', res);
    }
    
    return successResponse(course, res, { message: 'Course details fetched successfully' });
  });

  static getCategories = catchAsync(async (req: Request, res: Response) => {
    const categories = await CategoryService.getActiveCategories();
    return successResponse(categories, res, { message: 'Categories fetched successfully' });
  });

  static getMyEnrollments = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id;  // TypeScript knows this is safe
    
    const enrollments = await EnrollmentService.getUserEnrollments(userId!);
    return successResponse(enrollments, res, { message: 'Enrollments fetched successfully' });
  });

  static enrollInCourse = catchAsync(async (req: Request, res: Response) => {
    const { id: courseId } = req.params;
    const userId = req.user!._id;
    const enrollmentData = req.body;
    
    const enrollment = await EnrollmentService.createEnrollment(courseId, userId, enrollmentData);
    return successResponse(enrollment, res, { message: 'Successfully enrolled in course' });
  });

  static getMyCourses = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const options = extractListOptions(req);
    
    const courses = await EnrollmentService.getUserEnrollments(userId);
    return successResponse(courses, res, { message: 'Courses fetched successfully' });
  });

  static reviewCourse = catchAsync(async (req: Request, res: Response) => {
    const { id: enrollmentId } = req.params;
    const { rating, review } = req.body;
    
    const enrollment = await EnrollmentService.addReview(enrollmentId, rating, review);
    return successResponse(enrollment, res, { message: 'Review added successfully' });
  });

  static updateProgress = catchAsync(async (req: Request, res: Response) => {
    const { id: enrollmentId } = req.params;
    const { progress } = req.body;
    
    const enrollment = await EnrollmentService.updateEnrollmentProgress(enrollmentId, progress);
    if (!enrollment) {
      return errorResponse('Enrollment not found', res);
    }
    
    return successResponse(enrollment, res, { message: 'Progress updated successfully' });
  });
} 