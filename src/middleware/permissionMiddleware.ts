import { Request, Response, NextFunction } from 'express';
import { UserModel } from '@/models/User';

export const checkPermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const user = await UserModel.findById(req.user._id).populate({
        path: 'roles',
        populate: {
          path: 'permissions'
        }
      });

      if (!user) {
        return res.status(403).json({ message: 'User not found' });
      }

      const hasPermission = user.roles.some(role => 
        role.permissions.some((permission: any) => permission.code === requiredPermission)
      );

      if (!hasPermission) {
        return res.status(403).json({ 
          message: 'You do not have permission to perform this action' 
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ 
        message: 'Error checking permissions',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}; 