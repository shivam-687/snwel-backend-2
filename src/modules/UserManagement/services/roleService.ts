import { RoleModel, IRole } from '../models/Role';
import { PermissionModel, IPermission } from '../models/Permission';

export class RoleService {
  private static async getPermissionIdsByCode(permissionCodes: string[]): Promise<string[]> {
    const permissions = await PermissionModel.find({ 
      code: { $in: permissionCodes } 
    });
    return permissions.map(p => p._id.toString());
  }

  static async createRole(roleData: {
    name: string;
    description: string;
    permissions: string[]; // permission codes
  }): Promise<IRole> {
    try {
      const permissionIds = await this.getPermissionIdsByCode(roleData.permissions);
      
      const role = await RoleModel.create({
        name: roleData.name,
        description: roleData.description,
        permissions: permissionIds
      });

      return await role.populate('permissions');
    } catch (error: any) {
      throw new Error(`Failed to create role: ${error.message}`);
    }
  }

  static async updateRole(roleId: string, updateData: {
    name?: string;
    description?: string;
    permissions?: string[]; // permission codes
  }): Promise<IRole | null> {
    try {
      const role = await RoleModel.findById(roleId);
      if (role?.isSystem) {
        throw new Error('System roles cannot be modified');
      }

      const updatePayload: any = { ...updateData };
      if (updateData.permissions) {
        const permissionIds = await this.getPermissionIdsByCode(updateData.permissions);
        updatePayload.permissions = permissionIds;
      }

      return await RoleModel.findByIdAndUpdate(
        roleId,
        updatePayload,
        { new: true }
      ).populate('permissions');
    } catch (error: any) {
      throw new Error(`Failed to update role: ${error.message}`);
    }
  }

  static async deleteRole(roleId: string): Promise<void> {
    try {
      const role = await RoleModel.findById(roleId);
      if (role?.isSystem) {
        throw new Error('System roles cannot be deleted');
      }

      await RoleModel.findByIdAndDelete(roleId);
    } catch (error: any) {
      throw new Error(`Failed to delete role: ${error.message}`);
    }
  }

  static async getAllRoles() {
    try {
      return await RoleModel.paginate(
        {},
        {
          populate: {
            path: 'permissions'
          }
        }
      );
    } catch (error: any) {
      throw new Error(`Failed to fetch roles: ${error.message}`);
    }
  }

  static async assignPermissions(roleId: string, permissionIds: string[]): Promise<IRole | null> {
    try {
      const role = await RoleModel.findById(roleId);
      if (role?.isSystem) {
        throw new Error('System roles permissions cannot be modified');
      }

      return await RoleModel.findByIdAndUpdate(
        roleId,
        { permissions: permissionIds },
        { new: true }
      ).populate('permissions');
    } catch (error: any) {
      throw new Error(`Failed to assign permissions: ${error.message}`);
    }
  }

  static async getRoleById(roleId: string): Promise<IRole | null> {
    try {
      return await RoleModel.findById(roleId)
        .populate('permissions')
        .exec();
    } catch (error: any) {
      throw new Error(`Failed to fetch role: ${error.message}`);
    }
  }
} 