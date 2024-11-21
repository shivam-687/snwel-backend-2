import { Response } from 'express';
import { parseErrorMessage } from '.';

// Define enum for status codes
enum StatusCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}

interface CustomResponse {
    status: number;
    message: string;
    data?: any;
}

const CommonResponses = {
    USER_REGISTERED_SUCCESSFULLY: { status: StatusCode.CREATED, message: 'User registered successfully' },
    USER_LOGGED_IN_SUCCESSFULLY: { status: StatusCode.OK, message: 'User logged in successfully' },
    INTERNAL_SERVER_ERROR: { status: StatusCode.INTERNAL_SERVER_ERROR, message: 'Internal server error' },
    NOT_FOUND: {status: StatusCode.NOT_FOUND, message: "Not Found"},
    UNAUTHORIZED: {status: StatusCode.UNAUTHORIZED, message: "Unauthorized"},
    FORBIDDEN: {status: StatusCode.FORBIDDEN, message: "Forbidden"},
    BAD_REQUEST: {status: StatusCode.BAD_REQUEST, message: "Bad Request"},
    OK: {status: StatusCode.OK, message: "Success"}
};

// Function to send response with proper status code, message, and optional data
const sendResponse = (res: Response, response: CustomResponse): void => {
    const responseData: CustomResponse = {
        status: response.status||200,
        message: response.message||'Sucess',
        data: response.data
    };
    res.status(response.status).json(responseData);
};

const successResponse = (data: any, res: Response, options?:{status?: number, message?: string}) => {
    const op: CustomResponse = {
        status: options?.status || 200,
        message: options?.message || 'Success',
        data
    }
    return sendResponse(res, op);
}

const errorResponse = (_data: any, res: Response, options: {status: number, message: string} = CommonResponses.INTERNAL_SERVER_ERROR) => {
    const op: CustomResponse = {
        status: options?.status || CommonResponses.INTERNAL_SERVER_ERROR.status,
        message: options?.message || CommonResponses.INTERNAL_SERVER_ERROR.message
    }
    return sendResponse(res, op)
}
const errorResponseFromError = (error: any, res: Response) => {
    const parsedError = parseErrorMessage(error)
    const op: CustomResponse = {
        status:  parsedError?.status || CommonResponses.INTERNAL_SERVER_ERROR.status,
        message: parsedError?.message || CommonResponses.INTERNAL_SERVER_ERROR.message
    }
    return sendResponse(res, op)
}

const courseErrorResponse = {
    notFound: (data: any, res: Response) => errorResponse(data, res, {...CommonResponses.NOT_FOUND, message: "Course not found!"}),
}

const courseEnrollmentResponse = {
    notFound: (data: any, res: Response) => errorResponse(data, res, {...CommonResponses.NOT_FOUND, message: "Course Enrollment not found!"}),
}

export { 
    sendResponse, 
    StatusCode, 
    successResponse,
    errorResponse,
    courseErrorResponse,
    errorResponseFromError,
    courseEnrollmentResponse
};