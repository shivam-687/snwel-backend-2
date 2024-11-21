import { FilterQuery, PaginateOptions } from 'mongoose';
import { CourseEnrollmentModel, ICourseEnrollment } from '../models/CourseEnrollment';
import { CourseModel } from '../models/Course';

export class EnrollmentService {
  static async createEnrollment(
    courseId: string,
    userId: string,
    paymentAmount: number
  ): Promise<ICourseEnrollment> {
    try {
      // Check if user is already enrolled
      const existingEnrollment = await CourseEnrollmentModel.findOne({
        course: courseId,
        user: userId
      });

      if (existingEnrollment) {
        throw new Error('User is already enrolled in this course');
      }

      const enrollment = new CourseEnrollmentModel({
        course: courseId,
        user: userId,
        paymentAmount
      });

      const savedEnrollment = await enrollment.save();

      // Increment course enrollment count
      await CourseModel.findByIdAndUpdate(courseId, {
        $inc: { enrollmentCount: 1 }
      });

      return savedEnrollment;
    } catch (error) {
      throw error;
    }
  }

  static async updateEnrollmentStatus(
    enrollmentId: string,
    status: ICourseEnrollment['status']
  ): Promise<ICourseEnrollment | null> {
    try {
      return await CourseEnrollmentModel.findByIdAndUpdate(
        enrollmentId,
        { status },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  static async updateEnrollmentProgress(
    enrollmentId: string,
    progress: number
  ): Promise<ICourseEnrollment | null> {
    try {
      const enrollment = await CourseEnrollmentModel.findByIdAndUpdate(
        enrollmentId,
        { 
          progress,
          ...(progress === 100 ? { 
            status: 'completed',
            completionDate: new Date()
          } : {})
        },
        { new: true }
      );

      return enrollment;
    } catch (error) {
      throw error;
    }
  }

  static async addReview(
    enrollmentId: string,
    rating: number,
    review?: string
  ): Promise<ICourseEnrollment | null> {
    try {
      const enrollment = await CourseEnrollmentModel.findByIdAndUpdate(
        enrollmentId,
        { rating, review },
        { new: true }
      );

      if (enrollment) {
        // Update course rating
        const courseId = enrollment.course;
        const courseEnrollments = await CourseEnrollmentModel.find({
          course: courseId,
          rating: { $exists: true }
        });

        const totalRating = courseEnrollments.reduce((sum, e) => sum + (e.rating || 0), 0);
        const averageRating = totalRating / courseEnrollments.length;

        await CourseModel.findByIdAndUpdate(courseId, {
          rating: averageRating,
          ratingCount: courseEnrollments.length
        });
      }

      return enrollment;
    } catch (error) {
      throw error;
    }
  }

  static async getEnrollments(
    query: FilterQuery<ICourseEnrollment> = {},
    options: PaginateOptions = { page: 1, limit: 10 }
  ) {
    try {
      return await CourseEnrollmentModel.paginate(query, {
        ...options,
        populate: [
          { path: 'course', select: 'title slug thumbnail' },
          { path: 'user', select: 'name email' }
        ]
      });
    } catch (error) {
      throw error;
    }
  }

  static async getUserEnrollments(userId: string) {
    try {
      return await CourseEnrollmentModel.find({ user: userId })
        .populate('course', 'title slug thumbnail')
        .sort({ enrollmentDate: -1 });
    } catch (error) {
      throw error;
    }
  }
} 