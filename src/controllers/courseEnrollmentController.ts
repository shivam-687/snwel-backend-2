
import { Request, Response } from 'express';
import { courseEnrollmentResponse, courseErrorResponse, successResponse } from '@/utils/helpers/appResponse';
import { catchAsync } from '@/utils/helpers/catchAsync';
import { checkApplied, create, deleteById, getAll, getById, resendOtp, updateById, verifyOtpAndUpdate } from '@/service/courseQueryService';
import { CreateCourseQuery, CreateEnrollmentAnonymously } from '@/entity-schema/course-enrollment';
import { getUserByEmail, registerUser } from '@/service/userService';
import { ObjectId } from 'mongodb';
import { generateRandomPassword } from '@/utils/helpers';
import { Constants } from '@/config/constants';

// Function to get all courses
const getAllController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const courses = await getAll({...req.query});
    return successResponse(courses, res, { message: "Course Enrollments Fetched successfully!" })
});

// Function to create a new course
const createController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const courseData: CreateCourseQuery = req.body;
    const newCourse = await create(courseData);
    successResponse(newCourse, res);
})

const createByAnonymous = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const courseData: CreateEnrollmentAnonymously = req.body;
    const userExists = await getUserByEmail(courseData.email);
    if(userExists){
        const createdCourse = await create({
            userId: userExists._id,
            courseId: courseData.courseId,
        });
        return successResponse(createdCourse, res);
    }
    const newUser = await registerUser({
        email: courseData.email,
        name: courseData.name,
        password: generateRandomPassword(),
        phone: courseData.phone,
        roles: [Constants.ROLES.USER],
        location: courseData.location
    });

    const newEnroll = await create({
        courseId: courseData.courseId,
        userId: newUser._id
    });
    successResponse(newEnroll, res);
})

// Function to get course by id
const getByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if (!id) {
            return courseEnrollmentResponse.notFound(null, res)
        }
        const course = await getById(id)
        successResponse(course, res)
});

const updateController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
        return courseEnrollmentResponse.notFound(null, res)
    }
    const course = await updateById(id, req.body);
    successResponse(course, res, {message: "Course Enrollment Updated successfully!"})
});

const deleteController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
        return courseErrorResponse.notFound(null, res)
    }
     await deleteById(id);
    successResponse(null, res, {message: "Course Enrollment deleted successfully!"})
});

const verifyOtpController = catchAsync(async (req, res): Promise<any> => {
    const { token, otp } = req.body;
    
    if (!token || !otp) {
        throw new Error("Error: 400: Token and OTP are required")
    }
    const result = await verifyOtpAndUpdate(token, otp);
    successResponse(result, res);
    
});


const resendOtpController = catchAsync(async (req, res): Promise<any> => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    const result = await resendOtp(token);
    if (result.success) {
        successResponse({token: result.token}, res, { message: 'OTP resent successfully' });
    } else {
        res.status(400).json({ message: result.message });
    }
});





export {
    getAllController,
    createController,
    getByIdController,
    updateController,
    deleteController,
    createByAnonymous,
    verifyOtpController,
    resendOtpController
};
