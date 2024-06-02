"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAlreadyApplied = void 0;
const userService_1 = require("../service/userService");
const appResponse_1 = require("../utils/helpers/appResponse");
const courseQueryService_1 = require("../service/courseQueryService");
const checkAlreadyApplied = (isAnonymous = false) => {
    return async (req, res, next) => {
        const courseId = req.body.courseId;
        let user = null;
        if (isAnonymous) {
            user = await (0, userService_1.getUserByEmail)(req.body.email);
        }
        else {
            user = await (0, userService_1.getUserById)(req.body.userId);
        }
        if (!user)
            return (0, appResponse_1.errorResponse)(null, res, { message: "User Not found!", status: 404 });
        const isAlreadyApplied = await (0, courseQueryService_1.checkApplied)(user._id, courseId);
        if (isAlreadyApplied)
            return (0, appResponse_1.successResponse)(isAlreadyApplied, res, { message: "Already applied" });
        next();
    };
};
exports.checkAlreadyApplied = checkAlreadyApplied;
