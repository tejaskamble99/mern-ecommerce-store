import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import admin from './../utils/firebaseAdmin.js';
import { TryCatch } from "./error.js";


declare global {
  namespace Express {
    interface Request {
      user?: InstanceType<typeof User>;
      firebaseUser?: {
        uid: string;
        email?: string;
      };
    }
  }
}

export const verifyFirebaseToken = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return next(new ErrorHandler("Please login first", 401));
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = await admin.auth().verifyIdToken(token);

    req.firebaseUser = {
      uid: decoded.uid,
      email: decoded.email,
    };

    next();
  }
);

export const isAuthenticated = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return next(new ErrorHandler("Please login first", 401));
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = await admin.auth().verifyIdToken(token);

    const user = await User.findById(decoded.uid);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    req.user = user;
    next();
  }
);


export const adminOnly = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ErrorHandler("Not authenticated", 401));
    }

    if (req.user.role !== "admin") {
      return next(new ErrorHandler("Access denied. Admins only.", 403));
    }

    next();
  }
);
