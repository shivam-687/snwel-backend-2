import express from 'express';
import { authenticateJWT as validateToken } from '@/middleware/auth.middleware';
import { checkPermission } from '@/middleware/permissionMiddleware';

const router = express.Router();

// Course Routes
router.post(
  '/courses',
  validateToken,
  checkPermission('COURSE_CREATE'),
  // TODO: Add controller
);

router.get(
  '/courses',
  validateToken,
  checkPermission('COURSE_VIEW'),
  // TODO: Add controller
);

router.get(
  '/courses/:id',
  validateToken,
  checkPermission('COURSE_VIEW'),
  // TODO: Add controller
);

router.put(
  '/courses/:id',
  validateToken,
  checkPermission('COURSE_UPDATE'),
  // TODO: Add controller
);

router.delete(
  '/courses/:id',
  validateToken,
  checkPermission('COURSE_DELETE'),
  // TODO: Add controller
);

router.patch(
  '/courses/:id/publish',
  validateToken,
  checkPermission('COURSE_PUBLISH'),
  // TODO: Add controller
);

// Category Routes
router.post(
  '/categories',
  validateToken,
  checkPermission('CATEGORY_MANAGE'),
  // TODO: Add controller
);

router.get(
  '/categories',
  validateToken,
  checkPermission('CATEGORY_MANAGE'),
  // TODO: Add controller
);

router.put(
  '/categories/:id',
  validateToken,
  checkPermission('CATEGORY_MANAGE'),
  // TODO: Add controller
);

router.delete(
  '/categories/:id',
  validateToken,
  checkPermission('CATEGORY_MANAGE'),
  // TODO: Add controller
);

// Enrollment Management Routes
router.get(
  '/enrollments',
  validateToken,
  checkPermission('ENROLLMENT_VIEW'),
  // TODO: Add controller
);

router.patch(
  '/enrollments/:id/status',
  validateToken,
  checkPermission('ENROLLMENT_MANAGE'),
  // TODO: Add controller
);

export const AdminCourseRouter = router; 