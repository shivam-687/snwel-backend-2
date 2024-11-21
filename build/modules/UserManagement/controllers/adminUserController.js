"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserController = void 0;
const adminUserService_1 = require("../services/adminUserService");
const catchAsync_1 = require("../../../utils/helpers/catchAsync");
const appResponse_1 = require("../../../utils/helpers/appResponse");
class AdminUserController {
}
exports.AdminUserController = AdminUserController;
_a = AdminUserController;
AdminUserController.createUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userData = req.body;
    const user = await adminUserService_1.AdminUserService.createUser(userData);
    return (0, appResponse_1.successResponse)(user, res, { message: 'User created successfully' });
});
AdminUserController.updateUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const user = await adminUserService_1.AdminUserService.updateUser(id, updateData);
    if (!user) {
        return (0, appResponse_1.errorResponseFromError)(new Error('User not found'), res);
    }
    return (0, appResponse_1.successResponse)(user, res, { message: 'User updated successfully' });
});
AdminUserController.deleteUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await adminUserService_1.AdminUserService.deleteUser(id);
    return (0, appResponse_1.successResponse)(null, res, { message: 'User deleted successfully' });
});
AdminUserController.toggleUserStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
    const user = await adminUserService_1.AdminUserService.toggleUserStatus(id, isActive);
    if (!user) {
        return (0, appResponse_1.errorResponseFromError)(new Error('User not found'), res);
    }
    return (0, appResponse_1.successResponse)(user, res, {
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });
});
AdminUserController.assignRoles = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { roleIds } = req.body;
    const user = await adminUserService_1.AdminUserService.assignRoles(id, roleIds);
    if (!user) {
        return (0, appResponse_1.errorResponseFromError)(new Error('User not found'), res);
    }
    return (0, appResponse_1.successResponse)(user, res, { message: 'Roles assigned successfully' });
});
AdminUserController.getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const users = await adminUserService_1.AdminUserService.getAllUsers(req.query);
    return (0, appResponse_1.successResponse)(users, res, { message: 'Users fetched successfully' });
});
