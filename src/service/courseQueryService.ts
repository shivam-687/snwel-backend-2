import jwt from 'jsonwebtoken';

import { convertToPagination, generateJwtToken, generateOTP, generateOTPObject, getPaginationParams } from '@/utils/helpers';
import { ObjectId } from 'mongodb';
import { ListOptions, PaginatedList } from '@/types/custom'
import { CreateCourseQuery } from '@/entity-schema/course-enrollment';
import CourseEnrollmentModel, { CourseEnrollment } from '@/models/CourseEnrollment';
import { RegistrationInput } from './userService';
import dayjs from 'dayjs';
import { Constants } from '@/config/constants';
import { logger } from '@/utils/logger';
import emailService from './emailService';
import { UserModel } from '@/models/User';

// Function to create a new course
const create = async (queryData: CreateCourseQuery): Promise<{ token?: string, isVerified: boolean, enrollmentId?:string }> => {
    try {
        const exists = await CourseEnrollmentModel.findOne({ userId: queryData.userId, courseId: queryData.courseId });
        if (exists && exists.otp?.verified) {
            return {
                isVerified: true,
                enrollmentId: exists._id
            }
        }
        const user = await UserModel.findById(queryData.userId);
        const otpObject = generateOTPObject({})
        if (exists) {
            const updated = await exists.updateOne({ otp: otpObject });
            await emailService.sendOtp(user?.email || '', otpObject.otp)
            return {
                isVerified: false,
                token: generateJwtToken({
                    courseId: queryData.courseId,
                    userId: queryData.userId,
                    enrollmentId: updated._id
                })
            }
        } else {
            let newCourseQuery = new CourseEnrollmentModel({ ...queryData, otp: otpObject });
            await newCourseQuery.save()
            await emailService.sendOtp(user?.email || '', otpObject.otp)
            return {
                isVerified: false,
                token: generateJwtToken({
                    courseId: queryData.courseId,
                    userId: queryData.userId,
                    enrollmentId: newCourseQuery._id
                })
            }
        }
    } catch (error: any) {
        throw new Error(`Error: creating course query: ${error.message}`);
    }
};
const createByClient = async (queryData: CreateCourseQuery): Promise<CourseEnrollment> => {
    try {
        const exists = await CourseEnrollmentModel.findOne({ userId: queryData.userId, courseId: queryData.courseId });
        if (exists) throw new Error("Course Enrollment already found.");
        const newCourseQuery = new CourseEnrollmentModel(queryData);
        return await newCourseQuery.save();
    } catch (error: any) {
        throw new Error(`Error: creating course query: ${error.message}`);
    }
};

const checkApplied = async (userId: string, courseId: string) => {
    try {
        return await CourseEnrollmentModel.findOne({ userId: new ObjectId(userId), courseId: new ObjectId(courseId) }).populate("userId", ["email", "name", "profilePic"]).populate("courseId", "title slug");
    } catch (error: any) {
        throw new Error(`Error: validating course query: ${error.message}`);
    }
}
const getAllByUserId = async (userId: string) => {
    try {
        return await CourseEnrollmentModel.find({ userId }).populate("userId", ["email", "name", "profilePic"]).populate("courseId", "title slug");
    } catch (error: any) {
        throw new Error(`Error: feching course query by userId: ${error.message}`);
    }
}
const getAllByCourseId = async (userId: string) => {
    try {
        return await CourseEnrollmentModel.find({ userId }).populate("userId", ["email", "name", "profilePic"]).populate("courseId", "title slug");
    } catch (error: any) {
        throw new Error(`Error: feching course query by courseId: ${error.message}`);
    }
}

// Function to retrieve all courses
const getAll = async (options: ListOptions): Promise<PaginatedList<CourseEnrollment>> => {
    try {
        const { limit = 10, page = 1, filter } = options;
        const query: any = {};
        const paginationData = getPaginationParams(limit, page)
        if (filter && filter.search) {
            const searchRegex = new RegExp(filter.search, 'i');
            query.$or = [{ name: searchRegex }, { email: searchRegex }];
        }

        const skip = (page - 1) * limit;
        const users = await CourseEnrollmentModel
                    .find(query)
                    .skip(skip)
                    .limit(limit)
                    .populate("userId", ["email", "name", "profilePic"])
                    .populate("courseId", "title slug")
                    .select(['_id', "status", "paymentStatus", "otp.verified", "createdAt", "updatedAt", "paymentMethod"]);
        const count = await CourseEnrollmentModel.countDocuments(query);
        return convertToPagination(users, count, paginationData.limit, paginationData.offset);
    } catch (error: any) {
        throw new Error(`Error: retrieving courseQuery: ${error.message}`);
    }
};

// Function to retrieve a course by ID
const getById = async (id: string): Promise<CourseEnrollment | null> => {
    try {
        return await CourseEnrollmentModel.findById(id)
            .populate("userId", "email name profilePic")
            .populate("courseId");
    } catch (error: any) {
        throw new Error(`Error: retrieving course query: ${error.message}`);
    }
};

// Function to update a course by ID
const updateById = async (id: string, updateData: Partial<CourseEnrollment>): Promise<CourseEnrollment | null> => {
    try {
        await CourseEnrollmentModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
        return CourseEnrollmentModel.findOne({ _id: new ObjectId(id) }).populate("userId", "email name profilePic").populate("courseId", "title slug");
    } catch (error: any) {
        throw new Error(`Error: updating course query: ${error.message}`);
    }
};

// Function to delete a course by ID
const deleteById = async (id: string): Promise<void> => {
    try {
        await CourseEnrollmentModel.findByIdAndDelete(id).exec();
    } catch (error: any) {
        throw new Error(`Error: deleting course query: ${error.message}`);
    }
};
async function verifyOtpAndUpdate(token: string, otp: string) {
    try {
        const decoded = jwt.verify(token, Constants.TOKEN_SECRET) as any;
        const { enrollmentId, courseId, userId } = decoded;
        const enrollment = await CourseEnrollmentModel.findById(enrollmentId);
        if (!enrollment || !enrollment.otp) {
            return {
                isVerified: false,
                enrollmentId: null,
                invalidToken: true,
            }; // Document not found
        }

        if (enrollment.otp.verified) {
            return {
                isVerified: true,
                enrollmentId: enrollment._id
            }; // OTP already verified
        }

        const now = new Date();
       
        if ((enrollment.otp.otp !== otp && Number(otp) !== Constants.OTP.MASTER_OTP) || now > enrollment.otp.expirationTime) {
            return {
                isVerified: false,
                enrollmentId: null,
                invalidOtp: true
            }; // OTP is incorrect or expired
        }

        // Update the verified field to true
        enrollment.otp.verified = true;
        await enrollment.save();
        return {
            isVerified: true,
            enrollmentId: enrollment._id
        }; // OTP verified and updated successfully
    } catch (error) {
        console.error(error);
        logger.error("Error: verifyOtpAndUpdate: ", error)
        throw new Error("Error: 500: OTP Verification failed")
    }
}

async function resendOtp(token: string) {
    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, Constants.TOKEN_SECRET) as any;

        // Extract enrollmentId from the decoded token
        const { enrollmentId, courseId, userId } = decoded;

        // Find the document by enrollmentId
        const enrollment = await CourseEnrollmentModel.findById(enrollmentId);
        if (!enrollment) {
            return {
                isVerified: false,
                enrollmentId: null,
                invalidToken: true,
            };
        }

        // Generate a new OTP and expiration time
        const newOtp = generateOTPObject({})

        // Update the OTP in the document
        enrollment.otp = newOtp;
        await enrollment.save();

        // Generate a new JWT token
        const newToken = generateJwtToken({
            enrollmentId: enrollment._id.toString(),
            courseId: enrollment.courseId,
            userId: enrollment.userId
        })

        return {
            token: newToken
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred' };
    }
}

export { create, getAll, getById, updateById, deleteById, checkApplied, getAllByUserId, getAllByCourseId, verifyOtpAndUpdate, resendOtp };