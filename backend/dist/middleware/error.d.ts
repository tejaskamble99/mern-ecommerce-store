import { NextFunction, Request, Response } from "express";
import ErrorHandeler from "../utils/utility-class.js";
import { Controllertype } from "../types/types.js";
export declare const errorMiddleware: (err: ErrorHandeler, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const TryCatch: (func: Controllertype) => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
