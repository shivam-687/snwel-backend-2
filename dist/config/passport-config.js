"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const localStrategy = require('passport-local').Strategy;
const User_1 = require("@/models/User"); // Assuming you have your User model in a file named user.model.ts
const common_1 = require("./common");
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: common_1.CommonConfig.JWT_SECRET, // Replace with your actual secret key
    session: false
};
passport_1.default.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User_1.UserModel.create({ email, password });
        return done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
// ...
passport_1.default.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User_1.UserModel.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        const validate = await user.isValidPassword(password);
        if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
        }
        return done(null, user, { message: 'Logged in Successfully' });
    }
    catch (error) {
        return done(error);
    }
}));
passport_1.default.use(new passport_jwt_1.Strategy(jwtOptions, async (jwtPayload, done) => {
    // console.log("jwtPayload", jwtPayload)
    try {
        const user = await User_1.UserModel.findOne({ _id: jwtPayload.user._id });
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
    catch (error) {
        return done(error, false);
    }
}));
exports.default = passport_1.default;
