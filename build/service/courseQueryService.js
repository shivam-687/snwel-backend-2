"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOtp = exports.verifyOtpAndUpdate = exports.getAllByCourseId = exports.getAllByUserId = exports.checkApplied = exports.deleteById = exports.updateById = exports.getById = exports.getAll = exports.create = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helpers_1 = require("../utils/helpers");
const mongodb_1 = require("mongodb");
const CourseEnrollment_1 = __importDefault(require("../models/CourseEnrollment"));
const constants_1 = require("../config/constants");
const logger_1 = require("../utils/logger");
const User_1 = require("../models/User");
const templateFactory_1 = require("../email-templates/templateFactory");
const notificationService_1 = require("./notificationService");
// Function to create a new course
const create = async (queryData) => {
    try {
        const exists = await CourseEnrollment_1.default.findOne({ userId: queryData.userId, courseId: queryData.courseId });
        if (exists && exists.otp?.verified) {
            return {
                isVerified: true,
                enrollmentId: exists._id
            };
        }
        const user = await User_1.UserModel.findById(queryData.userId);
        const otpObject = (0, helpers_1.generateOTPObject)({});
        const emailTemplate = await (0, templateFactory_1.otpEmailTemplate)(otpObject.otp);
        const nfs = await notificationService_1.NotificationService.getInstance();
        if (exists) {
            const updated = await exists.updateOne({ otp: otpObject });
            await nfs.sendEmail(user?.email || "", emailTemplate.subject, emailTemplate.template);
            return {
                isVerified: false,
                token: (0, helpers_1.generateJwtToken)({
                    courseId: queryData.courseId,
                    userId: queryData.userId,
                    enrollmentId: updated._id
                })
            };
        }
        else {
            let newCourseQuery = new CourseEnrollment_1.default({ ...queryData, otp: otpObject });
            await newCourseQuery.save();
            await nfs.sendEmail(user?.email || "", emailTemplate.subject, emailTemplate.template);
            return {
                isVerified: false,
                token: (0, helpers_1.generateJwtToken)({
                    courseId: queryData.courseId,
                    userId: queryData.userId,
                    enrollmentId: newCourseQuery._id
                })
            };
        }
    }
    catch (error) {
        throw new Error(`Error: creating course query: ${error.message}`);
    }
};
exports.create = create;
const createByClient = async (queryData) => {
    try {
        const exists = await CourseEnrollment_1.default.findOne({ userId: queryData.userId, courseId: queryData.courseId });
        if (exists)
            throw new Error("Course Enrollment already found.");
        const newCourseQuery = new CourseEnrollment_1.default(queryData);
        return await newCourseQuery.save();
    }
    catch (error) {
        throw new Error(`Error: creating course query: ${error.message}`);
    }
};
const checkApplied = async (userId, courseId) => {
    try {
        return await CourseEnrollment_1.default.findOne({ userId: new mongodb_1.ObjectId(userId), courseId: new mongodb_1.ObjectId(courseId) }).populate("userId", ["email", "name", "profilePic"]).populate("courseId", "title slug");
    }
    catch (error) {
        throw new Error(`Error: validating course query: ${error.message}`);
    }
};
exports.checkApplied = checkApplied;
const getAllByUserId = async (userId) => {
    try {
        return await CourseEnrollment_1.default.find({ userId }).populate("userId", ["email", "name", "profilePic"]).populate("courseId", "title slug");
    }
    catch (error) {
        throw new Error(`Error: feching course query by userId: ${error.message}`);
    }
};
exports.getAllByUserId = getAllByUserId;
const getAllByCourseId = async (userId) => {
    try {
        return await CourseEnrollment_1.default.find({ userId }).populate("userId", ["email", "name", "profilePic"]).populate("courseId", "title slug");
    }
    catch (error) {
        throw new Error(`Error: feching course query by courseId: ${error.message}`);
    }
};
exports.getAllByCourseId = getAllByCourseId;
// Function to retrieve all courses
const getAll = async (options) => {
    try {
        const { limit = 10, page = 1, search, filter, sort, startDate, endDate } = options;
        const query = {};
        // Handle search
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ "userId.name": searchRegex }, { "courseId.title": searchRegex }];
        }
        // Handle filtering
        if (filter) {
            if (filter.status) {
                query.status = filter.status;
            }
            // Add more filters if necessary
        }
        // Handle date filtering
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }
        // Fetch and paginate the results
        const courseEnrollments = await CourseEnrollment_1.default.paginate(query, {
            populate: [
                { path: "userId", select: ["email", "name", "profilePic"] },
                { path: "courseId", select: ["title", "slug"] },
                { path: "qualification" }, // Use object for path
                { path: "mode" }, // Use object for path
                { path: "occupation" }, // Use object for path
                { path: "widget" } // Use object for path
            ],
            page,
            limit,
            sort: sort ? (0, helpers_1.convertSortOrder)(sort) : { createdAt: -1 }
        });
        return courseEnrollments;
    }
    catch (error) {
        throw new Error(`Error retrieving course enrollments: ${error.message}`);
    }
};
exports.getAll = getAll;
// Function to retrieve a course by ID
const getById = async (id) => {
    try {
        return await CourseEnrollment_1.default.findById(id)
            .populate("userId", "email name profilePic")
            .populate(["courseId", 'qualification', 'mode', 'occupation', 'widget']);
    }
    catch (error) {
        throw new Error(`Error: retrieving course query: ${error.message}`);
    }
};
exports.getById = getById;
// Function to update a course by ID
const updateById = async (id, updateData) => {
    try {
        await CourseEnrollment_1.default.findByIdAndUpdate(id, updateData, { new: true }).exec();
        return CourseEnrollment_1.default.findOne({ _id: new mongodb_1.ObjectId(id) }).populate("userId", "email name profilePic").populate("courseId", "title slug");
    }
    catch (error) {
        throw new Error(`Error: updating course query: ${error.message}`);
    }
};
exports.updateById = updateById;
// Function to delete a course by ID
const deleteById = async (id) => {
    try {
        await CourseEnrollment_1.default.findByIdAndDelete(id).exec();
    }
    catch (error) {
        throw new Error(`Error: deleting course query: ${error.message}`);
    }
};
exports.deleteById = deleteById;
async function verifyOtpAndUpdate(token, otp) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, constants_1.Constants.TOKEN_SECRET);
        const { enrollmentId, courseId, userId } = decoded;
        const enrollment = await CourseEnrollment_1.default.findById(enrollmentId).populate(["courseId", "userId"]);
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
        if ((enrollment.otp.otp !== otp && Number(otp) !== constants_1.Constants.OTP.MASTER_OTP) || now > enrollment.otp.expirationTime) {
            return {
                isVerified: false,
                enrollmentId: null,
                invalidOtp: true
            }; // OTP is incorrect or expired
        }
        // Update the verified field to true
        enrollment.otp.verified = true;
        await enrollment.save();
        const user = enrollment.userId;
        await (0, notificationService_1.sendCourseEnquiryNotification)(enrollment.courseId, { email: user?.email, phone: user?.phone, userName: user?.name });
        return {
            isVerified: true,
            enrollmentId: enrollment._id
        }; // OTP verified and updated successfully
    }
    catch (error) {
        console.error(error);
        logger_1.logger.error("Error: verifyOtpAndUpdate: ", error);
        throw new Error("Error: 500: OTP Verification failed");
    }
}
exports.verifyOtpAndUpdate = verifyOtpAndUpdate;
async function resendOtp(token) {
    try {
        // Verify the JWT token
        const decoded = jsonwebtoken_1.default.verify(token, constants_1.Constants.TOKEN_SECRET);
        // Extract enrollmentId from the decoded token
        const { enrollmentId, courseId, userId } = decoded;
        // Find the document by enrollmentId
        const enrollment = await CourseEnrollment_1.default.findById(enrollmentId);
        if (!enrollment) {
            return {
                isVerified: false,
                enrollmentId: null,
                invalidToken: true,
            };
        }
        // Generate a new OTP and expiration time
        const newOtp = (0, helpers_1.generateOTPObject)({});
        // Update the OTP in the document
        enrollment.otp = newOtp;
        await enrollment.save();
        // Generate a new JWT token
        const newToken = (0, helpers_1.generateJwtToken)({
            enrollmentId: enrollment._id.toString(),
            courseId: enrollment.courseId,
            userId: enrollment.userId
        });
        return {
            token: newToken
        };
    }
    catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred' };
    }
}
exports.resendOtp = resendOtp;
