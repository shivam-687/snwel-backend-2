"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = void 0;
const appResponse_1 = require("./appResponse");
function catchAsync(func) {
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        }
        catch (error) {
            (0, appResponse_1.errorResponseFromError)(error, res);
        }
    };
}
exports.catchAsync = catchAsync;
