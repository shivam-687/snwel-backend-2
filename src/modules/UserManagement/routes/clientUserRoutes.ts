import { Router } from 'express';
import { ClientUserController } from '../controllers/clientUserController';
import { validateSchema } from '@/middleware/validateSchema';
import passport from 'passport';

const router = Router();

// All routes require authentication
router.use(passport.authenticate('jwt', { session: false }));

router.get(
  '/profile',
  ClientUserController.getProfile
);

router.put(
  '/profile',
//   validateSchema(updateProfileSchema),
  ClientUserController.updateProfile
);

router.post(
  '/change-password',
//   validateSchema(changePasswordSchema),
  ClientUserController.changePassword
);

router.delete(
  '/account',
//   validateSchema(changePasswordSchema), // Reuse password validation
  ClientUserController.deleteAccount
);

export { router as ClientUserRouter }; 