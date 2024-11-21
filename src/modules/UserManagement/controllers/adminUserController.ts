import { Request, Response } from 'express';
import { AdminUserService } from '../services/adminUserService';
import { RoleService } from '../services/roleService';
import { catchAsync } from '@/utils/helpers/catchAsync';
import { errorResponseFromError, successResponse } from '@/utils/helpers/appResponse';

export class AdminUserController {
  static createUser = catchAsync(async (req: Request, res: Response) => {
    const userData = req.body;
    const user = await AdminUserService.createUser(userData);
    return successResponse(user, res, { message: 'User created successfully' });
  });

  static updateUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const user = await AdminUserService.updateUser(id, updateData);
    
    if (!user) {
      return errorResponseFromError(new Error('User not found'), res);
    }
    
    return successResponse(user, res, { message: 'User updated successfully' });
  });

  static deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await AdminUserService.deleteUser(id);
    return successResponse(null, res, { message: 'User deleted successfully' });
  });

  static toggleUserStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const user = await AdminUserService.toggleUserStatus(id, isActive);
    if (!user) {
      return errorResponseFromError(new Error('User not found'), res);
    }
    
    return successResponse(user, res, { 
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully` 
    });
  });

  static assignRoles = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { roleIds } = req.body;
    
    const user = await AdminUserService.assignRoles(id, roleIds);
    if (!user) {
      return errorResponseFromError(new Error('User not found'), res);
    }
    
    return successResponse(user, res, { message: 'Roles assigned successfully' });
  });

  static getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await AdminUserService.getAllUsers(req.query);
    return successResponse(users, res, { message: 'Users fetched successfully' });
  });
} 