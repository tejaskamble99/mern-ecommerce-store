import { NextFunction, Request, Response } from "express";
export interface NewUserRequestBody {
    name: string;
    email: string;
    photo: string;
    userId: string;
    gender: string;
    dob: Date;
}
export type Controllertype = (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
