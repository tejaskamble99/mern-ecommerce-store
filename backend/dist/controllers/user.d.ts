import { NextFunction, Request, Response } from "express";
import { newUserRequestBody } from "../types/types.js";
export declare const newUser: (req: Request<{}, {}, newUserRequestBody>, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
