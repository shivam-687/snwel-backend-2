import { CourseModel, Course, COURSE_STATUS } from '@/models/CourseModel';
import { convertToPagination, getPaginationParams } from '@/utils/helpers';
import { ObjectId } from 'mongodb';
import {ListOptions, PaginatedList} from '@/types/custom'
import { CourseCategoryModel } from '@/models/CourseCategory';
import { Types } from 'mongoose';
import Master from '@/models/MasterModel';

// Function to create a new course
const createCourse = async (courseData: Course): Promise<Course> => {
    try {
        const curData = courseData.curriculum.map(cr => ({...cr, curriculumType: cr.curriculumType ? new ObjectId(cr.curriculumType) : undefined}))
        const newCourse = new CourseModel({...courseData, curriculum: curData});
        return await newCourse.save();
    } catch (error: any) {
        throw new Error(`Error: creating course: ${error.message}`);
    }
};

// Function to retrieve all courses
const getAllCourses = async (options: ListOptions, adminMode=false): Promise<PaginatedList<Course>> => {
    try {
        const { limit = 10, page = 1, filter, search } = options;
        const query: any = {}; 
        const paginationData = getPaginationParams(limit, page);

        if(!adminMode){
            query.status = COURSE_STATUS.PUBLISHED;
        }
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

        if(filter && Object.keys(filter).some((value) => ['qualifications', 'trainingModes'].includes(value))){
            Object.entries(filter).forEach(([key, value]) => {
                query[key] = {
                    $in: [value]
                }
            })
        }
      
        const skip = (page - 1) * limit;
        const users = await CourseModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .populate('instructors')
        .populate('categories')
        .populate('qualifications', '_id name code')
        .populate('trainingModes', '_id name code')
        .populate('curriculum.curriculumType', 'name');
        const count = await CourseModel.countDocuments(query);
        return convertToPagination(users, count, paginationData.limit, paginationData.offset);
    } catch (error: any) {
        throw new Error(`Error: retrieving courses: ${error.message}`);
    }
};

// Function to retrieve a course by ID
const getCourseById = async (courseId: string): Promise<Course | null> => {
    try {
        const query = Types.ObjectId.isValid(courseId)
        ?  { _id: courseId }
        : { slug: courseId };
        return await CourseModel.findById(query).populate(['instructors', 'categories', 'curriculum.curriculumType']);
    } catch (error: any) {
        throw new Error(`Error: retrieving course: ${error.message}`);
    }
};

const getCourseBySlug = async (slug: string, admin=false): Promise<Course | null> => {
    try {
        const query: any = Types.ObjectId.isValid(slug)
        ?  { _id: slug }
        : { slug: slug };

        if(admin){
            query.status = COURSE_STATUS.PUBLISHED;
        }
        const cs = await CourseModel
        .findOne(query)
        .populate(['instructors', 'categories', 'curriculum.curriculumType', 'qualifications', 'trainingModes'])
        ;
        return cs;
    } catch (error: any) {
        throw new Error(`Error: retrieving course: ${error.message}`);
    }
};

// Function to update a course by ID
const updateCourseById = async (courseId: string, updateData: Partial<Course>): Promise<Course | null> => {
    try {
        if(updateData.curriculum){
            updateData.curriculum = updateData?.curriculum?.map(cr => ({...cr, curriculumType: cr.curriculumType ? new ObjectId(cr.curriculumType) : undefined})) as any[]
        }
        await CourseModel.findByIdAndUpdate(courseId, updateData, { new: true }).exec();
        return CourseModel.findOne({ _id: new ObjectId(courseId) });
    } catch (error: any) {
        throw new Error(`Error: updating course: ${error.message}`);
    }
};

const partialUpdateCourse = async (courseId: string, updateData: Partial<Course>): Promise<Course | null> => {
    try {
        await CourseModel.findByIdAndUpdate(courseId, updateData, { new: true }).exec();
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

export { createCourse, getAllCourses, getCourseById, updateCourseById, deleteCourseById, getCourseBySlug, partialUpdateCourse };
