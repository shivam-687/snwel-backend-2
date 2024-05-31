"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseErrorResponse = exports.errorResponse = exports.successResponse = exports.StatusCode = exports.sendResponse = void 0;
// Define enum for status codes
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
// Function to send response with proper status code, message, and optional data
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
        status: options?.status || 200,
        message: options?.message || 'Success',
        data
    };
    return sendResponse(res, op);
};
exports.successResponse = successResponse;
const errorResponse = (data, res, options = CommonResponses.INTERNAL_SERVER_ERROR) => {
    const op = {
        status: options?.status || CommonResponses.INTERNAL_SERVER_ERROR.status,
        message: options?.message || CommonResponses.INTERNAL_SERVER_ERROR.message
    };
    return sendResponse(res, op);
};
exports.errorResponse = errorResponse;
const courseErrorResponse = {
    notFound: (data, res) => errorResponse(data, res, { ...CommonResponses.NOT_FOUND, message: "Course not found!" }),
};
exports.courseErrorResponse = courseErrorResponse;
