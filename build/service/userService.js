"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.updateUser = exports.listUsers = exports.getUserById = exports.getUserByEmail = exports.verifyLogin = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../models/User");
const helpers_1 = require("../utils/helpers");
const mongodb_1 = require("mongodb");
async function registerUser(userData) {
    const { name, email, password, phone, roles, location } = userData;
    const existingUser = await User_1.UserModel.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }
    // const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User_1.UserModel.create({
        name,
        email,
        password,
        phone,
        roles,
        location,
        courses: [],
        webinars: [],
        appliedJobs: [],
    });
    return createdUser;
}
exports.registerUser = registerUser;
async function verifyLogin(loginData) {
    const { email, password } = loginData;
    const user = await User_1.UserModel.findOne({ email });
    if (!user) {
        return {
            isValid: false,
            user: null
        };
    }
    const isValidPassword = await bcrypt_1.default.compare(password, user.password);
    if (!isValidPassword) {
        return {
            isValid: false,
            user: null
        };
    }
    return {
        isValid: true,
        user
    };
}
exports.verifyLogin = verifyLogin;
async function getUserByEmail(email) {
    const user = await User_1.UserModel.findOne({ email });
    return user;
}
exports.getUserByEmail = getUserByEmail;
async function getUserById(id) {
    const user = await User_1.UserModel.findOne({ _id: new mongodb_1.ObjectId(id) });
    return user;
}
exports.getUserById = getUserById;
async function listUsers(options) {
    const { limit = 10, page = 1, filter } = options;
    const query = {};
    const paginationData = (0, helpers_1.getPaginationParams)(limit, page);
    if (filter && filter.search) {
        const searchRegex = new RegExp(filter.search, 'i');
        query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }
    if (filter && filter.roles) {
        query.roles = { $in: filter.roles };
    }
    const skip = (page - 1) * limit;
    const users = await User_1.UserModel.find(query).skip(skip).limit(limit);
    const count = await User_1.UserModel.countDocuments(query);
    return (0, helpers_1.convertToPagination)(users, count, paginationData.limit, paginationData.offset);
}
exports.listUsers = listUsers;
async function updateUser(userData) {
    const { userId, updates } = userData;
    try {
        const updatedUser = await User_1.UserModel.findByIdAndUpdate(userId, updates, { new: true });
        return updatedUser;
    }
    catch (error) {
        console.error('Error updating user:', error);
        return null;
    }
}
exports.updateUser = updateUser;
async function me(userId) {
    const user = await User_1.UserModel.findOne({ _id: userId }).select(['name', 'email', 'phone', 'roles', 'profilePic', 'location']);
    return user;
}
exports.me = me;
