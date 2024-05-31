import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { User } from '@/models/User';
import { getUserByEmail, getUserById } from '@/service/userService';
import { errorResponse, successResponse } from '@/utils/helpers/appResponse';
import { checkApplied } from '@/service/courseQueryService';

export const checkAlreadyApplied = (isAnonymous = false) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const courseId = req.body.courseId;
        let user: User|null = null;
        if(isAnonymous){
            user = await getUserByEmail(req.body.email);
        }else{
            user = await getUserById(req.body.userId);
        }
        if(!user) return errorResponse(null, res, {message: "User Not found!", status: 404});

        const isAlreadyApplied = await checkApplied(user._id, courseId);
        if(isAlreadyApplied)return successResponse(isAlreadyApplied, res, {message: "Already applied"});
        next();
      };
}
