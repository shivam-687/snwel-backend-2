import { Request, Response } from 'express';
import { ClientUserService } from '../services/clientUserService';
import { catchAsync } from '@/utils/helpers/catchAsync';
import { errorResponseFromError, successResponse } from '@/utils/helpers/appResponse';

export class ClientUserController {
  static getProfile = catchAsync(async (req: Request, res: Response) => {
        const userId = (req.user as any)?._id; // Assuming user is attached to request by auth middleware
    if (!userId) {
      throw new Error('User ID is required');
    }
    const profile = await ClientUserService.getProfile(userId);
    
    if (!profile) {
      return errorResponseFromError(new Error('Profile not found'), res);
    }
    
    return successResponse(profile, res);
  });

  static updateProfile = catchAsync(async (req: Request, res: Response) => {
        const userId = (req.user as any)?._id; // Assuming user is attached to request by auth middleware
    const updateData = req.body;
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const profile = await ClientUserService.updateProfile(userId, updateData);
    if (!profile) {
      return errorResponseFromError(new Error('Profile not found'), res);
    }
    
    return successResponse(profile, res, { message: 'Profile updated successfully' });
  });

  static changePassword = catchAsync(async (req: Request, res: Response) => {
        const userId = (req.user as any)?._id; // Assuming user is attached to request by auth middleware
    const { oldPassword, newPassword } = req.body;
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    await ClientUserService.changePassword(userId, oldPassword, newPassword);
    return successResponse(null, res, { message: 'Password changed successfully' });
  });

  static deleteAccount = catchAsync(async (req: Request, res: Response) => {
        const userId = (req.user as any)?._id; // Assuming user is attached to request by auth middleware
    const { password } = req.body;
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    await ClientUserService.deleteAccount(userId, password);
    return successResponse(null, res, { message: 'Account deleted successfully' });
  });
} 