"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const roleService_1 = require("../services/roleService");
const catchAsync_1 = require("../../../utils/helpers/catchAsync");
const appResponse_1 = require("../../../utils/helpers/appResponse");
class RoleController {
}
exports.RoleController = RoleController;
_a = RoleController;
RoleController.createRole = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const roleData = req.body;
    const role = await roleService_1.RoleService.createRole(roleData);
    return (0, appResponse_1.successResponse)(role, res, { message: 'Role created successfully' });
});
RoleController.getAllRoles = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const roles = await roleService_1.RoleService.getAllRoles();
    return (0, appResponse_1.successResponse)(roles, res, { message: 'Roles fetched successfully' });
});
RoleController.updateRole = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const role = await roleService_1.RoleService.updateRole(id, updateData);
    if (!role) {
        return (0, appResponse_1.errorResponseFromError)(new Error('Role not found'), res);
    }
    return (0, appResponse_1.successResponse)(role, res, { message: 'Role updated successfully' });
});
RoleController.deleteRole = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await roleService_1.RoleService.deleteRole(id);
    return (0, appResponse_1.successResponse)(null, res, { message: 'Role deleted successfully' });
});
RoleController.assignPermissions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { permissionIds } = req.body;
    const role = await roleService_1.RoleService.assignPermissions(id, permissionIds);
    if (!role) {
        return (0, appResponse_1.errorResponseFromError)(new Error('Role not found'), res);
    }
    return (0, appResponse_1.successResponse)(role, res, { message: 'Permissions assigned successfully' });
});
RoleController.getRoleById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const role = await roleService_1.RoleService.getRoleById(id);
    if (!role) {
        return (0, appResponse_1.errorResponseFromError)(new Error('Role not found'), res);
    }
    return (0, appResponse_1.successResponse)(role, res, { message: 'Role fetched successfully' });
});
