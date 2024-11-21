import express from 'express';
import { authenticateJWT as validateToken } from '@/middleware/auth.middleware';

const router = express.Router();

// Public Course Routes
router.get(
  '/courses',
  // TODO: Add controller for listing published courses
);

router.get(
  '/courses/:id',
  // TODO: Add controller for viewing course details
);

router.get(
  '/categories',
  // TODO: Add controller for listing categories
);

// Protected Course Routes (requires authentication)
router.post(
  '/courses/:id/enroll',
  validateToken,
  // TODO: Add controller for course enrollment
);

router.get(
  '/my-courses',
  validateToken,
  // TODO: Add controller for user's enrolled courses
);

router.post(
  '/courses/:id/review',
  validateToken,
  // TODO: Add controller for course review
);

router.get(
  '/my-enrollments',
  validateToken,
  // TODO: Add controller for user's enrollments
);

router.patch(
  '/enrollments/:id/progress',
  validateToken,
  // TODO: Add controller for updating course progress
);

export const ClientCourseRouter = router; 