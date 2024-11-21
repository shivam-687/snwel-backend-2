"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = void 0;
const User_1 = require("../../../models/User");
const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        var _a;
        try {
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const user = await User_1.UserModel.findById(userId).populate({
                path: 'roles',
                populate: {
                    path: 'permissions'
                }
            });
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            const hasPermission = user.roles.some(role => role.permissions.some((permission) => permission.code === requiredPermission));
            if (!hasPermission) {
                return res.status(403).json({ message: 'Permission denied' });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.checkPermission = checkPermission;
