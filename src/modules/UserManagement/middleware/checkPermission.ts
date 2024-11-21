import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../../../models/User';
import { IPermission } from '../models/Permission';

export const checkPermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req?.user as any)?._id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await UserModel.findById(userId).populate({
        path: 'roles',
        populate: {
          path: 'permissions'
        }
      });

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const hasPermission = user.roles.some(role => 
        role.permissions.some((permission: IPermission) => permission.code === requiredPermission)
      );

      if (!hasPermission) {
        return res.status(403).json({ message: 'Permission denied' });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}; 