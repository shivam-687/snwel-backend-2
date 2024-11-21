"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const Course_1 = require("../models/Course");
const helpers_1 = require("../../../utils/helpers");
class CourseService {
    static async createCourse(courseData, userId) {
        try {
            const slug = (0, helpers_1.createSlug)(courseData.title);
            const course = new Course_1.CourseModel(Object.assign(Object.assign({}, courseData), { slug, createdBy: userId, updatedBy: userId }));
            return await course.save();
        }
        catch (error) {
            throw error;
        }
    }
    static async updateCourse(courseId, courseData, userId) {
        try {
            if (courseData.title) {
                courseData.slug = (0, helpers_1.createSlug)(courseData.title);
            }
            const course = await Course_1.CourseModel.findByIdAndUpdate(courseId, Object.assign(Object.assign({}, courseData), { updatedBy: userId }), { new: true });
            return course;
        }
        catch (error) {
            throw error;
        }
    }
    static async deleteCourse(courseId) {
        try {
            const result = await Course_1.CourseModel.findByIdAndDelete(courseId);
            return !!result;
        }
        catch (error) {
            throw error;
        }
    }
    static async getCourseById(courseId) {
        try {
            return await Course_1.CourseModel.findById(courseId)
                .populate('category', 'name slug')
                .populate('instructor', 'name email');
        }
        catch (error) {
            throw error;
        }
    }
    static async getCourses(query = {}, options = { page: 1, limit: 10 }) {
        try {
            return await Course_1.CourseModel.paginate(query, Object.assign(Object.assign({}, options), { populate: [
                    { path: 'category', select: 'name slug' },
                    { path: 'instructor', select: 'name email' }
                ] }));
        }
        catch (error) {
            throw error;
        }
    }
    static async publishCourse(courseId, publish) {
        try {
            return await Course_1.CourseModel.findByIdAndUpdate(courseId, { isPublished: publish }, { new: true });
        }
        catch (error) {
            throw error;
        }
    }
    static async getPublishedCourses(query = {}, options = { page: 1, limit: 10 }) {
        try {
            return await Course_1.CourseModel.paginate(Object.assign(Object.assign({}, query), { isPublished: true, isActive: true }), Object.assign(Object.assign({}, options), { populate: [
                    { path: 'category', select: 'name slug' },
                    { path: 'instructor', select: 'name email' }
                ] }));
        }
        catch (error) {
            throw error;
        }
    }
}
exports.CourseService = CourseService;
