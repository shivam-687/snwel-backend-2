"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentService = void 0;
const CourseEnrollment_1 = require("../models/CourseEnrollment");
const Course_1 = require("../models/Course");
class EnrollmentService {
    static async createEnrollment(courseId, userId, paymentAmount) {
        try {
            const existingEnrollment = await CourseEnrollment_1.CourseEnrollmentModel.findOne({
                course: courseId,
                user: userId
            });
            if (existingEnrollment) {
                throw new Error('User is already enrolled in this course');
            }
            const enrollment = new CourseEnrollment_1.CourseEnrollmentModel({
                course: courseId,
                user: userId,
                paymentAmount
            });
            const savedEnrollment = await enrollment.save();
            await Course_1.CourseModel.findByIdAndUpdate(courseId, {
                $inc: { enrollmentCount: 1 }
            });
            return savedEnrollment;
        }
        catch (error) {
            throw error;
        }
    }
    static async updateEnrollmentStatus(enrollmentId, status) {
        try {
            return await CourseEnrollment_1.CourseEnrollmentModel.findByIdAndUpdate(enrollmentId, { status }, { new: true });
        }
        catch (error) {
            throw error;
        }
    }
    static async updateEnrollmentProgress(enrollmentId, progress) {
        try {
            const enrollment = await CourseEnrollment_1.CourseEnrollmentModel.findByIdAndUpdate(enrollmentId, Object.assign({ progress }, (progress === 100 ? {
                status: 'completed',
                completionDate: new Date()
            } : {})), { new: true });
            return enrollment;
        }
        catch (error) {
            throw error;
        }
    }
    static async addReview(enrollmentId, rating, review) {
        try {
            const enrollment = await CourseEnrollment_1.CourseEnrollmentModel.findByIdAndUpdate(enrollmentId, { rating, review }, { new: true });
            if (enrollment) {
                const courseId = enrollment.course;
                const courseEnrollments = await CourseEnrollment_1.CourseEnrollmentModel.find({
                    course: courseId,
                    rating: { $exists: true }
                });
                const totalRating = courseEnrollments.reduce((sum, e) => sum + (e.rating || 0), 0);
                const averageRating = totalRating / courseEnrollments.length;
                await Course_1.CourseModel.findByIdAndUpdate(courseId, {
                    rating: averageRating,
                    ratingCount: courseEnrollments.length
                });
            }
            return enrollment;
        }
        catch (error) {
            throw error;
        }
    }
    static async getEnrollments(query = {}, options = { page: 1, limit: 10 }) {
        try {
            return await CourseEnrollment_1.CourseEnrollmentModel.paginate(query, Object.assign(Object.assign({}, options), { populate: [
                    { path: 'course', select: 'title slug thumbnail' },
                    { path: 'user', select: 'name email' }
                ] }));
        }
        catch (error) {
            throw error;
        }
    }
    static async getUserEnrollments(userId) {
        try {
            return await CourseEnrollment_1.CourseEnrollmentModel.find({ user: userId })
                .populate('course', 'title slug thumbnail')
                .sort({ enrollmentDate: -1 });
        }
        catch (error) {
            throw error;
        }
    }
}
exports.EnrollmentService = EnrollmentService;
