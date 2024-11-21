import express from 'express';
import { register } from '@/controllers/authController';
import passport from '@/config/passport-config';
import { CommonConfig } from '@/config/common';
import { errorResponse } from '@/utils/helpers/appResponse';
import { validateSchema } from '@/middleware/validateSchema';
import { z } from 'zod';
import jwt from 'jsonwebtoken'

const AuthRouter = express.Router();

// Register route
AuthRouter.post('/register', register)


AuthRouter.post(
  '/login',
  validateSchema(z.object({email: z.string().email(), password: z.string().min(3)})),
  async (req, res, next) => {
    passport.authenticate(
      'login',
      async (err: any, user: any, _info: any) => {
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
              console.log({user})
              return res.json({ token, email: user.email, name: user.name, roles: user.roles, picture: user.profilePic, id: user?._id });
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
