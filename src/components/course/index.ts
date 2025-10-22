import { Application, NextFunction, Request, Response } from "express";
import  Routes from "./routes";

export const courseComponent = (app: Application) => {
    // app.use('/admin/course', Routes.AdminCourseRouter);
    app.use('/course', Routes.CourseRouter)
}