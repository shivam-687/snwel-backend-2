
import passport from '@/config/passport-config';
import { errorResponse, errorResponseFromError } from '@/utils/helpers/appResponse';
import { Request, Response, NextFunction } from 'express';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (error: any, user: Express.User | undefined, info: any) => {
        if (error) {
            return errorResponseFromError(error, res);
        }
        if (!user) {
            return errorResponse(null, res, {status: 401, message: "Unauthenticated!"})
        }
        // If authentication is successful, attach the user object to the request
        req.user = user;
        next();
    })(req, res, next);
};
