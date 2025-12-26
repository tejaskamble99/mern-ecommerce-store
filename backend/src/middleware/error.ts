import { NextFunction, Request, Response } from "express";
import ErrorHandeler from "../utils/utility-class.js";
import { Controllertype } from "../types/types.js";
export const errorMiddleware = (
  err: ErrorHandeler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "something went wrong";
  err.statusCode ||= 500;
  return res.status(err.statusCode).json({
    success: true,
    message: err.message,
  });
};

export const TryCatch =
  (func: Controllertype) =>{
     return  (req: Request, res: Response, next: NextFunction) => {
    return  Promise.resolve(func(req, res, next)).catch(next);
  };
  };


