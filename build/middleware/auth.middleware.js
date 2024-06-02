"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const passport_config_1 = __importDefault(require("../config/passport-config"));
const appResponse_1 = require("../utils/helpers/appResponse");
const authenticateJWT = (req, res, next) => {
    passport_config_1.default.authenticate('jwt', { session: false }, (error, user, info) => {
        if (error) {
            return (0, appResponse_1.errorResponseFromError)(error, res);
        }
        if (!user) {
            return (0, appResponse_1.errorResponse)(null, res, { status: 401, message: "Unauthenticated!" });
        }
        // If authentication is successful, attach the user object to the request
        req.user = user;
        next();
    })(req, res, next);
};
exports.authenticateJWT = authenticateJWT;
