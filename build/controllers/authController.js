"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = require("../service/userService");
const appResponse_1 = require("../utils/helpers/appResponse");
const register = async (req, res) => {
    try {
        const newUser = await (0, userService_1.registerUser)(Object.assign({}, req.body));
        return (0, appResponse_1.successResponse)(newUser, res, { message: "User registered successfully!" });
    }
    catch (error) {
        console.error('Error registering user:', error);
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
};
exports.register = register;
const login = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (error, user, _info) => {
        if (error) {
            return (0, appResponse_1.errorResponseFromError)(error, res);
        }
        if (!user) {
            return (0, appResponse_1.errorResponse)(null, res, { status: 401, message: "Invalid Credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ sub: user.id }, 'your_secret_key_here', { expiresIn: '1h' });
        res.status(200).json({ token });
    })(req, res, next);
};
exports.login = login;
