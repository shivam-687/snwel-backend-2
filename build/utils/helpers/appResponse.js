"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseEnrollmentResponse = exports.errorResponseFromError = exports.courseErrorResponse = exports.errorResponse = exports.successResponse = exports.StatusCode = exports.sendResponse = void 0;
const _1 = require(".");
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["CREATED"] = 201] = "CREATED";
    StatusCode[StatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCode[StatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    StatusCode[StatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCode[StatusCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(StatusCode || (exports.StatusCode = StatusCode = {}));
const CommonResponses = {
    USER_REGISTERED_SUCCESSFULLY: { status: StatusCode.CREATED, message: 'User registered successfully' },
    USER_LOGGED_IN_SUCCESSFULLY: { status: StatusCode.OK, message: 'User logged in successfully' },
    INTERNAL_SERVER_ERROR: { status: StatusCode.INTERNAL_SERVER_ERROR, message: 'Internal server error' },
    NOT_FOUND: { status: StatusCode.NOT_FOUND, message: "Not Found" },
    UNAUTHORIZED: { status: StatusCode.UNAUTHORIZED, message: "Unauthorized" },
    FORBIDDEN: { status: StatusCode.FORBIDDEN, message: "Forbidden" },
    BAD_REQUEST: { status: StatusCode.BAD_REQUEST, message: "Bad Request" },
    OK: { status: StatusCode.OK, message: "Success" }
};
const sendResponse = (res, response) => {
    const responseData = {
        status: response.status || 200,
        message: response.message || 'Sucess',
        data: response.data
    };
    res.status(response.status).json(responseData);
};
exports.sendResponse = sendResponse;
const successResponse = (data, res, options) => {
    const op = {
        status: (options === null || options === void 0 ? void 0 : options.status) || 200,
        message: (options === null || options === void 0 ? void 0 : options.message) || 'Success',
        data
    };
    return sendResponse(res, op);
};
exports.successResponse = successResponse;
const errorResponse = (_data, res, options = CommonResponses.INTERNAL_SERVER_ERROR) => {
    const op = {
        status: (options === null || options === void 0 ? void 0 : options.status) || CommonResponses.INTERNAL_SERVER_ERROR.status,
        message: (options === null || options === void 0 ? void 0 : options.message) || CommonResponses.INTERNAL_SERVER_ERROR.message
    };
    return sendResponse(res, op);
};
exports.errorResponse = errorResponse;
const errorResponseFromError = (error, res) => {
    const parsedError = (0, _1.parseErrorMessage)(error);
    const op = {
        status: (parsedError === null || parsedError === void 0 ? void 0 : parsedError.status) || CommonResponses.INTERNAL_SERVER_ERROR.status,
        message: (parsedError === null || parsedError === void 0 ? void 0 : parsedError.message) || CommonResponses.INTERNAL_SERVER_ERROR.message
    };
    return sendResponse(res, op);
};
exports.errorResponseFromError = errorResponseFromError;
const courseErrorResponse = {
    notFound: (data, res) => errorResponse(data, res, Object.assign(Object.assign({}, CommonResponses.NOT_FOUND), { message: "Course not found!" })),
};
exports.courseErrorResponse = courseErrorResponse;
const courseEnrollmentResponse = {
    notFound: (data, res) => errorResponse(data, res, Object.assign(Object.assign({}, CommonResponses.NOT_FOUND), { message: "Course Enrollment not found!" })),
};
exports.courseEnrollmentResponse = courseEnrollmentResponse;
