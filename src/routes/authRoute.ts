
import express from 'express';
import { register, login } from '@/controllers/authController';
import { authenticateJWT } from '@/middleware/auth.middleware';
import passport from '@/config/passport-config';
import { CommonConfig } from '@/config/common';
import { errorResponse } from '@/utils/helpers/appResponse';
import { validateSchema } from '@/middleware/validateSchema';
import { z } from 'zod';
const jwt = require('jsonwebtoken');

const AuthRouter = express.Router();

// Register route
AuthRouter.post('/register', register)


AuthRouter.post(
  '/login',
  validateSchema(z.object({email: z.string().email(), password: z.string().min(3)})),
  async (req, res, next) => {
    passport.authenticate(
      'login',
      async (err: any, user: any, info: any) => {
        try {
          if (err) {
            return next(err);
          }
          if(!user){
            return errorResponse(null, res, {status: 401, message: "Unauthenticated!"})
          }
          req.login(
            user,
            { session: false },
            async (error) => {
              if (error) return next(error);
              const token = jwt.sign({ user }, CommonConfig.JWT_SECRET);
              return res.json({ token });
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }
);


export default AuthRouter;
