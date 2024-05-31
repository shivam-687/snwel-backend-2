import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { UserModel } from '@/models/User';
import bcrypt from 'bcrypt'
import { registerUser } from '@/service/userService';
import { errorResponse, errorResponseFromError, successResponse } from '@/utils/helpers/appResponse';
import { Constants } from '@/config/constants';

// Controller for user registration
export const register = async (req: Request, res: Response) => {
    try {

        const newUser = await registerUser({...req.body});
        return successResponse(newUser, res, {message: "User registered successfully!"});
    } catch (error) {
        console.error('Error registering user:', error);
        errorResponseFromError(error, res);
    }
};

// Controller for user login
export const login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (error: any, user: { id: any; }, info: any) => {
        if (error) {
            return errorResponseFromError(error, res);
        }
        if (!user) {
            return errorResponse(null, res, {status: 401, message: "Invalid Credentials"});
        }

        // Generate JWT token
        const token = jwt.sign({ sub: user.id }, 'your_secret_key_here', { expiresIn: '1h' });
        res.status(200).json({ token });
    })(req, res, next);
};
