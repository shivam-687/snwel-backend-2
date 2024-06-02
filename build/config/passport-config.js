"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const localStrategy = require('passport-local').Strategy;
const common_1 = require("./common");
const userService_1 = require("../service/userService");
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: common_1.CommonConfig.JWT_SECRET, // Replace with your actual secret key
    session: false
};
passport_1.default.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const result = await (0, userService_1.verifyLogin)({ email, password });
        if (!result?.isValid || !result.user) {
            return done(null, false);
        }
        return done(null, result.user, { message: 'Logged in Successfully' });
    }
    catch (error) {
        return done(error);
    }
}));
passport_1.default.use(new passport_jwt_1.Strategy(jwtOptions, async (jwtPayload, done) => {
    // console.log("jwtPayload", jwtPayload)
    try {
        const user = await (0, userService_1.getUserById)(jwtPayload.user._id);
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
    catch (error) {
        console.log("Error", error);
        return done(error, false);
    }
}));
exports.default = passport_1.default;