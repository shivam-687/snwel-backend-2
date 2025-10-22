import { Router } from 'express';
import passport from 'passport';
import { checkPermission } from '@/middleware/permissionMiddleware';
import * as permissionsController from '@/controllers/admin/permissionsController';

const router = Router();

// Permissions list endpoint - requires authentication and permission to view roles
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkPermission('ROLE_VIEW'),
  permissionsController.listAllPermissions
);

export { router as AdminPermissionsRouter };
