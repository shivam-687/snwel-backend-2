import { CourseModel, Course } from '@/models/CourseModel';
import { convertToPagination, getPaginationParams } from '@/utils/helpers';
import { ObjectId } from 'mongodb';
import {ListOptions, PaginatedList} from '@/types/custom'
import { CourseCategoryModel } from '@/models/CourseCategory';

// Function to create a new course
const createCourse = async (courseData: Course): Promise<Course> => {
    try {
        const newCourse = new CourseModel(courseData);
        return await newCourse.save();
    } catch (error: any) {
        throw new Error(`Error: creating course: ${error.message}`);
    }
};

// Function to retrieve all courses
const getAllCourses = async (options: ListOptions): Promise<PaginatedList<Course>> => {
    try {
        const { limit = 10, page = 1, filter, search } = options;
        const query: any = {}; 
        const paginationData = getPaginationParams(limit, page)
        if (search) {
          const searchRegex = new RegExp(search, 'i');
          query.$or = [{ name: searchRegex }, { email: searchRegex }];
        }
        if(filter && filter.categoryIds && filter.categoryIds.length > 0){
            query['categories'] = {
                $in: filter.categoryIds.map((ctg: any) => new ObjectId(ctg))
            }
        }
        if(filter && filter.category){
            const ctg = await CourseCategoryModel.findOne({slug: filter.category});
            query['categories'] = {
                $in: new ObjectId(ctg?._id)
            }
        }

        if(filter && filter?.isPremium){
            query["isPremium"] = true
        }
        if(filter && filter?.isPopular){
            query["isPopular"] = true
        }
      
        const skip = (page - 1) * limit;
        const users = await CourseModel.find(query).skip(skip).limit(limit).populate(['instructors', 'categories']);
        const count = await CourseModel.countDocuments(query);
        return convertToPagination(users, count, paginationData.limit, paginationData.offset);
    } catch (error: any) {
        throw new Error(`Error: retrieving courses: ${error.message}`);
    }
};

// Function to retrieve a course by ID
const getCourseById = async (courseId: string): Promise<Course | null> => {
    try {
        return await CourseModel.findById(courseId).populate(['instructors', 'categories']);
    } catch (error: any) {
        throw new Error(`Error: retrieving course: ${error.message}`);
    }
};

const getCourseBySlug = async (slug: string): Promise<Course | null> => {
    try {
        const cs = await CourseModel.findOne({ slug }).populate(['instructors', 'categories']);
        console.log({cs, slug})
        return cs;
    } catch (error: any) {
        throw new Error(`Error: retrieving course: ${error.message}`);
    }
};

// Function to update a course by ID
const updateCourseById = async (courseId: string, updateData: Partial<Course>): Promise<Course | null> => {
    try {
        await CourseModel.findByIdAndUpdate(courseId, updateData, { new: true }).exec();
        if (updateData.curriculum) {
            const course = await CourseModel.findOne({ _id: new ObjectId(courseId) });
            if (!course) {
                throw new Error('Course not found');
            }
            course.curriculum = updateData.curriculum;
            await course.save();
        }
        return CourseModel.findOne({ _id: new ObjectId(courseId) });
    } catch (error: any) {
        throw new Error(`Error: updating course: ${error.message}`);
    }
};

// Function to delete a course by ID
const deleteCourseById = async (courseId: string): Promise<void> => {
    try {
        await CourseModel.findByIdAndDelete(courseId).exec();
    } catch (error: any) {
        throw new Error(`Error: deleting course: ${error.message}`);
    }
};

export { createCourse, getAllCourses, getCourseById, updateCourseById, deleteCourseById, getCourseBySlug };
