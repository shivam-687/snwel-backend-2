"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserService = void 0;
const User_1 = require("../../../models/User");
class AdminUserService {
    static async createUser(userData) {
        try {
            const user = await User_1.UserModel.create(userData);
            return user.populate('roles');
        }
        catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }
    static async updateUser(userId, updateData) {
        try {
            const user = await User_1.UserModel.findByIdAndUpdate(userId, updateData, { new: true }).populate('roles');
            return user;
        }
        catch (error) {
            throw new Error(`Failed to update user: ${error.message}`);
        }
    }
    static async deleteUser(userId) {
        try {
            await User_1.UserModel.findByIdAndDelete(userId);
        }
        catch (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }
    static async toggleUserStatus(userId, isActive) {
        try {
            return await User_1.UserModel.findByIdAndUpdate(userId, { isActive }, { new: true }).populate('roles');
        }
        catch (error) {
            throw new Error(`Failed to toggle user status: ${error.message}`);
        }
    }
    static async assignRoles(userId, roleIds) {
        try {
            return await User_1.UserModel.findByIdAndUpdate(userId, { roles: roleIds }, { new: true }).populate('roles');
        }
        catch (error) {
            throw new Error(`Failed to assign roles: ${error.message}`);
        }
    }
    static async getAllUsers(options) {
        try {
            const { page = 1, limit = 10, search, sort } = options;
            const query = {};
            if (search) {
                query.$or = [
                    { name: new RegExp(search, 'i') },
                    { email: new RegExp(search, 'i') }
                ];
            }
            const users = await User_1.UserModel.find(query)
                .populate('roles')
                .skip((page - 1) * limit)
                .limit(limit)
                .sort(sort || { createdAt: -1 });
            const total = await User_1.UserModel.countDocuments(query);
            return {
                docs: users,
                total,
                page,
                limit
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }
}
exports.AdminUserService = AdminUserService;
