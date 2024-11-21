"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOtpController = exports.verifyOtpController = exports.createByAnonymous = exports.deleteController = exports.updateController = exports.getByIdController = exports.createController = exports.getAllController = void 0;
const appResponse_1 = require("../utils/helpers/appResponse");
const catchAsync_1 = require("../utils/helpers/catchAsync");
const courseQueryService_1 = require("../service/courseQueryService");
const userService_1 = require("../service/userService");
const helpers_1 = require("../utils/helpers");
const constants_1 = require("../config/constants");
const getAllController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const courses = await (0, courseQueryService_1.getAll)(Object.assign({}, req.query));
    return (0, appResponse_1.successResponse)(courses, res, { message: "Course Enrollments Fetched successfully!" });
});
exports.getAllController = getAllController;
const createController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const courseData = req.body;
    const newCourse = await (0, courseQueryService_1.create)(courseData);
    (0, appResponse_1.successResponse)(newCourse, res);
});
exports.createController = createController;
const createByAnonymous = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const courseData = req.body;
    const userExists = await (0, userService_1.getUserByEmail)(courseData.email);
    if (userExists) {
        const createdCourse = await (0, courseQueryService_1.create)({
            userId: userExists._id,
            courseId: courseData.courseId,
            extra: courseData.extra,
            qualification: courseData.qualification,
            mode: courseData.mode,
            occupation: courseData.occupation,
            widget: courseData.widget
        });
        return (0, appResponse_1.successResponse)(createdCourse, res);
    }
    const newUser = await (0, userService_1.registerUser)({
        email: courseData.email,
        name: courseData.name,
        password: (0, helpers_1.generateRandomPassword)(),
        phone: courseData.phone,
        roles: [constants_1.Constants.ROLES.USER],
        location: courseData.location
    });
    const newEnroll = await (0, courseQueryService_1.create)({
        courseId: courseData.courseId,
        userId: newUser === null || newUser === void 0 ? void 0 : newUser._id,
        extra: courseData.extra,
        qualification: courseData.qualification,
        mode: courseData.mode,
        occupation: courseData.occupation,
        widget: courseData.widget
    });
    (0, appResponse_1.successResponse)(newEnroll, res);
});
exports.createByAnonymous = createByAnonymous;
const getByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return appResponse_1.courseEnrollmentResponse.notFound(null, res);
    }
    const course = await (0, courseQueryService_1.getById)(id);
    (0, appResponse_1.successResponse)(course, res);
});
exports.getByIdController = getByIdController;
const updateController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return appResponse_1.courseEnrollmentResponse.notFound(null, res);
    }
    const course = await (0, courseQueryService_1.updateById)(id, req.body);
    (0, appResponse_1.successResponse)(course, res, { message: "Course Enrollment Updated successfully!" });
});
exports.updateController = updateController;
const deleteController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return appResponse_1.courseErrorResponse.notFound(null, res);
    }
    await (0, courseQueryService_1.deleteById)(id);
    (0, appResponse_1.successResponse)(null, res, { message: "Course Enrollment deleted successfully!" });
});
exports.deleteController = deleteController;
const verifyOtpController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { token, otp } = req.body;
    if (!token || !otp) {
        throw new Error("Error: 400: Token and OTP are required");
    }
    const result = await (0, courseQueryService_1.verifyOtpAndUpdate)(token, otp);
    (0, appResponse_1.successResponse)(result, res);
});
exports.verifyOtpController = verifyOtpController;
const resendOtpController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }
    const result = await (0, courseQueryService_1.resendOtp)(token);
    if (result.success) {
        (0, appResponse_1.successResponse)({ token: result.token }, res, { message: 'OTP resent successfully' });
    }
    else {
        res.status(400).json({ message: result.message });
    }
});
exports.resendOtpController = resendOtpController;
