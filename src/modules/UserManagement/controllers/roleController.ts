import { Request, Response } from 'express';
import { RoleService } from '../services/roleService';
import { catchAsync } from '@/utils/helpers/catchAsync';
import { errorResponseFromError, successResponse } from '@/utils/helpers/appResponse';

export class RoleController {
  static createRole = catchAsync(async (req: Request, res: Response) => {
    const roleData = req.body;
    const role = await RoleService.createRole(roleData);
    return successResponse(role, res, { message: 'Role created successfully' });
  });

  static getAllRoles = catchAsync(async (req: Request, res: Response) => {
    const roles = await RoleService.getAllRoles();
    return successResponse(roles, res, { message: 'Roles fetched successfully' });
  });

  static updateRole = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const role = await RoleService.updateRole(id, updateData);
    
    if (!role) {
      return errorResponseFromError(new Error('Role not found'), res);
    }
    
    return successResponse(role, res, { message: 'Role updated successfully' });
  });

  static deleteRole = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await RoleService.deleteRole(id);
    return successResponse(null, res, { message: 'Role deleted successfully' });
  });

  static assignPermissions = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { permissionIds } = req.body;
    
    const role = await RoleService.assignPermissions(id, permissionIds);
    if (!role) {
      return errorResponseFromError(new Error('Role not found'), res);
    }
    
    return successResponse(role, res, { message: 'Permissions assigned successfully' });
  });

  static getRoleById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const role = await RoleService.getRoleById(id);
    
    if (!role) {
      return errorResponseFromError(new Error('Role not found'), res);
    }
    
    return successResponse(role, res, { message: 'Role fetched successfully' });
  });
} 