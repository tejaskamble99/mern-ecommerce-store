import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middleware/error.js";
import ErrorHandler from "../utils/utility-class.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, photo, gender, _id, dob } = req.body;
    const firebaseUser = req.firebaseUser;

    if (!firebaseUser) {
      return next(new ErrorHandler("Please login first", 401));
    }

    if (_id && _id !== firebaseUser.uid) {
      return next(new ErrorHandler("Invalid user identity", 403));
    }

    if (!name || !email || !photo || !gender || !dob) {
      return next(new ErrorHandler("Please enter all fields", 400));
    }

    let user = await User.findById(firebaseUser.uid);

    if (user) {
      return res.status(200).json({
        success: true,
        message: `Welcome, ${user.name}`,
      });
    }

    user = await User.create({
      _id: firebaseUser.uid,
      name,
      email: firebaseUser.email || email,
      photo,
      gender,
      dob: new Date(dob),
    });

    return res.status(201).json({
      success: true,
      message: `User ${user.name} created successfully`,
      user,
    });
  }
);

export const getAllUsers = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({});

    return res.status(200).json({
      success: true,
      users,
    });
  }
);

export const getUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = await User.findById(id); // Use findById directly

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    return res.status(200).json({
      success: true,
      user,
    });
  }
);

export const deleteUser = TryCatch(
  async (req , res, next) =>{
    const id = req.params.id;
    const user = await User.findById(id);
       if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
     
    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message : "User deleted successfully",
    })

  }
);
