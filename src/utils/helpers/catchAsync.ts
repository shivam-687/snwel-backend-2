import { NextFunction, Request, Response } from "express"
import { errorResponseFromError } from "./appResponse"

 type CatchAsyncProps = {
    func: (req: Request, res: Response, next: NextFunction) => Promise<void>
}

export function catchAsync(func: (req: Request, res: Response, next: NextFunction) => Promise<void> ) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await func(req, res, next);
        } catch (error) {
            errorResponseFromError(error, res);
        }
    }
}