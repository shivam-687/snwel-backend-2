import { Request, Response } from 'express';
import { getAllCourses, getCourseById, getCourseBySlug } from '@/components/course/service/courseService'
import { courseErrorResponse,successResponse } from '@/utils/helpers/appResponse';
import { catchAsync } from '@/utils/helpers/catchAsync';
import { extractListOptions } from '@/utils/helpers';



// Function to get all courses
const getAllCoursesController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const courses = await getAllCourses(extractListOptions(req));
    return successResponse(courses, res, { message: "Course Fetched successfully!" })
});

// Function to get course by id
const getCourseByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const { courseId } = req.params;
        if (!courseId) {
            return courseErrorResponse.notFound(null, res)
        }
        const course = await getCourseById(courseId);
        successResponse(course, res)
});

const getCourseBySlugController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;

    if (!slug) {
        return courseErrorResponse.notFound(null, res)
    }
    const course = await getCourseBySlug(slug);
    successResponse(course, res)
});


export {
    getAllCoursesController,
    getCourseByIdController,
    getCourseBySlugController,
};
