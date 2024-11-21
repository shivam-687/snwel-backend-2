import { Router } from 'express';
import { AdminUserController } from '../controllers/adminUserController';
import { checkPermission } from '../middleware/checkPermission';
import { validateSchema } from '@/middleware/validateSchema';
// import { createUserSchema, updateUserSchema } from '../entity-schema/userSchema';
import passport from 'passport';

const router = Router();

// All routes require authentication
router.use(passport.authenticate('jwt', { session: false }));

// User Management Routes
router.post(
  '/',
  checkPermission('USER_CREATE'),
//   validateSchema(createUserSchema),
  AdminUserController.createUser
);

router.get(
  '/',
  checkPermission('USER_VIEW'),
  AdminUserController.getAllUsers
);

router.put(
  '/:id',
  checkPermission('USER_UPDATE'),
//   validateSchema(updateUserSchema),
  AdminUserController.updateUser
);

router.delete(
  '/:id',
  checkPermission('USER_DELETE'),
  AdminUserController.deleteUser
);

router.patch(
  '/:id/status',
  checkPermission('USER_UPDATE'),
  AdminUserController.toggleUserStatus
);

router.post(
  '/:id/roles',
  checkPermission('ROLE_ASSIGN'),
  AdminUserController.assignRoles
);

export { router as AdminUserRouter }; 