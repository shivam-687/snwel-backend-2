"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const Role_1 = require("../models/Role");
const Permission_1 = require("../models/Permission");
class RoleService {
    static async getPermissionIdsByCode(permissionCodes) {
        const permissions = await Permission_1.PermissionModel.find({
            code: { $in: permissionCodes }
        });
        return permissions.map(p => p._id.toString());
    }
    static async createRole(roleData) {
        try {
            const permissionIds = await this.getPermissionIdsByCode(roleData.permissions);
            const role = await Role_1.RoleModel.create({
                name: roleData.name,
                description: roleData.description,
                permissions: permissionIds
            });
            return await role.populate('permissions');
        }
        catch (error) {
            throw new Error(`Failed to create role: ${error.message}`);
        }
    }
    static async updateRole(roleId, updateData) {
        try {
            const role = await Role_1.RoleModel.findById(roleId);
            if (role === null || role === void 0 ? void 0 : role.isSystem) {
                throw new Error('System roles cannot be modified');
            }
            const updatePayload = Object.assign({}, updateData);
            if (updateData.permissions) {
                const permissionIds = await this.getPermissionIdsByCode(updateData.permissions);
                updatePayload.permissions = permissionIds;
            }
            return await Role_1.RoleModel.findByIdAndUpdate(roleId, updatePayload, { new: true }).populate('permissions');
        }
        catch (error) {
            throw new Error(`Failed to update role: ${error.message}`);
        }
    }
    static async deleteRole(roleId) {
        try {
            const role = await Role_1.RoleModel.findById(roleId);
            if (role === null || role === void 0 ? void 0 : role.isSystem) {
                throw new Error('System roles cannot be deleted');
            }
            await Role_1.RoleModel.findByIdAndDelete(roleId);
        }
        catch (error) {
            throw new Error(`Failed to delete role: ${error.message}`);
        }
    }
    static async getAllRoles() {
        try {
            return await Role_1.RoleModel.paginate({}, {
                populate: {
                    path: 'permissions'
                }
            });
        }
        catch (error) {
            throw new Error(`Failed to fetch roles: ${error.message}`);
        }
    }
    static async assignPermissions(roleId, permissionIds) {
        try {
            const role = await Role_1.RoleModel.findById(roleId);
            if (role === null || role === void 0 ? void 0 : role.isSystem) {
                throw new Error('System roles permissions cannot be modified');
            }
            return await Role_1.RoleModel.findByIdAndUpdate(roleId, { permissions: permissionIds }, { new: true }).populate('permissions');
        }
        catch (error) {
            throw new Error(`Failed to assign permissions: ${error.message}`);
        }
    }
    static async getRoleById(roleId) {
        try {
            return await Role_1.RoleModel.findById(roleId)
                .populate('permissions')
                .exec();
        }
        catch (error) {
            throw new Error(`Failed to fetch role: ${error.message}`);
        }
    }
}
exports.RoleService = RoleService;
