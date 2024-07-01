import { getUserById, listUsers, me, updateUser } from "@/service/userService";
import { errorResponseFromError, successResponse } from "@/utils/helpers/appResponse";
import { Request, Response } from "express";

export const getUserListController = async (req: Request, res: Response) => {
    try {
        const user = await listUsers({...req.query});
        return successResponse(user, res)
    } catch (error) {
        return errorResponseFromError(error, res)
    }
}

export const updateUserController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const user = await updateUser({userId: id, updates: req.body});
        return successResponse(user, res)
    } catch (error) {
        return errorResponseFromError(error, res)
    }
}

export const getUserController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const user = await getUserById(id);
        return successResponse(user, res)
    } catch (error) {
        return errorResponseFromError(error, res)
    }
}

export const getMeController = async (req: Request, res: Response) => {
    try {
        const user = await me(req.user?._id||'');
        return successResponse(user, res)
    } catch (error) {
        return errorResponseFromError(error, res)
    }
}

