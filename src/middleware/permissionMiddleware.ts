import { Request, Response, NextFunction } from 'express';
import { UserModel } from '@/models/User';

export const checkPermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          code: 'UNAUTHORIZED',
          message: 'User not authenticated' 
        });
      }

      // Try to use permissions already populated on req.user (via JWT strategy)
      const reqUser: any = req.user as any;
      const rolesFromReq = Array.isArray(reqUser?.roles) ? reqUser.roles : [];
      const permissionsFromReq = rolesFromReq.flatMap((r: any) => r?.permissions || []);
      const hasPermissionsInReq = permissionsFromReq.length > 0 && typeof permissionsFromReq[0] === 'object';

      let hasPermission = false;

      if (hasPermissionsInReq) {
        hasPermission = rolesFromReq.some((role: any) =>
          (role.permissions || []).some((p: any) => p?.code === requiredPermission)
        );
      } else {
        // Fallback: fetch user with roles -> permissions populated
        const user = await UserModel.findById(reqUser._id).populate({
          path: 'roles',
          populate: {
            path: 'permissions'
          }
        });

        if (!user) {
          return res.status(403).json({ 
            success: false,
            code: 'USER_NOT_FOUND',
            message: 'User not found' 
          });
        }

        hasPermission = user.roles.some(role =>
          (role as any).permissions.some((permission: any) => permission.code === requiredPermission)
        );
      }

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          code: 'PERMISSION_DENIED',
          message: 'You do not have permission to perform this action',
          requiredPermission: requiredPermission
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        code: 'PERMISSION_CHECK_ERROR',
        message: 'Error checking permissions',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
};