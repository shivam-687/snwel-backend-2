import { Request, Response } from 'express';
import { createCourse, deleteCourseById, getAllCourses, getCourseById, getCourseBySlug, updateCourseById } from '@/service/courseService'
import { courseErrorResponse, errorResponse, errorResponseFromError, successResponse } from '@/utils/helpers/appResponse';
import { Course } from '@/models/CourseModel';
import { catchAsync } from '@/utils/helpers/catchAsync';
import { extractListOptions } from '@/utils/helpers';



// Function to get all courses
const getAllCoursesController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const courses = await getAllCourses(extractListOptions(req));
    return successResponse(courses, res, { message: "Course Fetched successfully!" })
});

// Function to create a new course
const createCourseController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const courseData: Course = req.body;
    const alreadyExists = await getCourseBySlug(courseData.slug);
    if(alreadyExists){
        return errorResponse(null, res, {message: "Course already exists!", status: 400})
    }
    const newCourse = await createCourse(courseData);
    successResponse(newCourse, res);
})

// Function to get course by id
const getCourseByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const { courseId } = req.params;
        if (!courseId) {
            return courseErrorResponse.notFound(null, res)
        }
        const course = await getCourseById(courseId)
        successResponse(course, res)
});

const getCourseBySlugController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;

    if (!slug) {
        return courseErrorResponse.notFound(null, res)
    }
    const course = await getCourseBySlug(slug);
    console.log({course})
    successResponse(course, res)
});
const updateCourseController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { courseId } = req.params;
    if (!courseId) {
        return courseErrorResponse.notFound(null, res)
    }
    const course = await updateCourseById(courseId, req.body);
    successResponse(course, res, {message: "Course Updated successfully!"})
});

const deleteCourseController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { courseId } = req.params;
    if (!courseId) {
        return courseErrorResponse.notFound(null, res)
    }
     await deleteCourseById(courseId);
    successResponse(null, res, {message: "Course deleted successfully!"})
});



export {
    getAllCoursesController,
    createCourseController,
    getCourseByIdController,
    getCourseBySlugController,
    updateCourseController,
    deleteCourseController
};
