import { Router } from 'express';
import passport from 'passport';
import { checkPermission } from '@/middleware/permissionMiddleware';
import { listAllPermissionsFlat } from '@/controllers/admin/permissionsController';

const router = Router();

// GET /api/admin/permissions-all
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkPermission('ROLE_VIEW'),
  listAllPermissionsFlat
);

export { router as AdminPermissionsAllRouter };
