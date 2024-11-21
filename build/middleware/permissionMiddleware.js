"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = void 0;
const User_1 = require("../models/User");
const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'User not authenticated' });
            }
            const user = await User_1.UserModel.findById(req.user._id).populate({
                path: 'roles',
                populate: {
                    path: 'permissions'
                }
            });
            if (!user) {
                return res.status(403).json({ message: 'User not found' });
            }
            const hasPermission = user.roles.some(role => role.permissions.some((permission) => permission.code === requiredPermission));
            if (!hasPermission) {
                return res.status(403).json({
                    message: 'You do not have permission to perform this action'
                });
            }
            next();
        }
        catch (error) {
            return res.status(500).json({
                message: 'Error checking permissions',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };
};
exports.checkPermission = checkPermission;
