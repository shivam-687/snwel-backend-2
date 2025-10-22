import { Router } from 'express';
import { RoleController } from '../controllers/roleController';
import { checkPermission } from '@/middleware/permissionMiddleware';
import passport from 'passport';

const router = Router();

// All routes require authentication
router.use(passport.authenticate('jwt', { session: false }));

// Role Management Routes
router.post(
  '/',
  checkPermission('ROLE_CREATE'),
  RoleController.createRole
);

router.get(
  '/',
  checkPermission('ROLE_VIEW'),
  RoleController.getAllRoles
);

router.get(
  '/:id',
  checkPermission('ROLE_VIEW'),
  RoleController.getRoleById
);

router.put(
  '/:id',
  checkPermission('ROLE_UPDATE'),
  RoleController.updateRole
);

router.delete(
  '/:id',
  checkPermission('ROLE_DELETE'),
  RoleController.deleteRole
);

// Assign permissions to a role
router.patch(
  '/:id/permissions',
  checkPermission('ROLE_UPDATE'),
  RoleController.assignPermissions
);

export { router as RoleRouter };