"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientUserService = void 0;
const User_1 = require("../../../models/User");
class ClientUserService {
    static async getProfile(userId) {
        try {
            const user = await User_1.UserModel.findById(userId)
                .populate('roles')
                .select('-password')
                .lean();
            return user;
        }
        catch (error) {
            throw new Error(`Failed to get profile: ${error.message}`);
        }
    }
    static async updateProfile(userId, updateData) {
        try {
            const allowedUpdates = ['name', 'phone', 'location', 'profilePic'];
            const sanitizedData = Object.keys(updateData)
                .filter(key => allowedUpdates.includes(key))
                .reduce((obj, key) => {
                obj[key] = updateData[key];
                return obj;
            }, {});
            return (await User_1.UserModel.findByIdAndUpdate(userId, sanitizedData, { new: true }).select('-password'));
        }
        catch (error) {
            throw new Error(`Failed to update profile: ${error.message}`);
        }
    }
    static async changePassword(userId, oldPassword, newPassword) {
        try {
            const user = await User_1.UserModel.findById(userId);
            if (!user)
                throw new Error('User not found');
            const isValid = await user.isValidPassword(oldPassword);
            if (!isValid)
                throw new Error('Invalid current password');
            user.password = newPassword;
            await user.save();
        }
        catch (error) {
            throw new Error(`Failed to change password: ${error.message}`);
        }
    }
    static async deleteAccount(userId, password) {
        try {
            const user = await User_1.UserModel.findById(userId);
            if (!user)
                throw new Error('User not found');
            const isValid = await user.isValidPassword(password);
            if (!isValid)
                throw new Error('Invalid password');
            await User_1.UserModel.findByIdAndDelete(userId);
        }
        catch (error) {
            throw new Error(`Failed to delete account: ${error.message}`);
        }
    }
}
exports.ClientUserService = ClientUserService;
