import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middleware/error.js";

export const newUser = TryCatch(
  async (
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
) => {

    const { name, email, photo, gender,userId, dob } = req.body;

    const user = await User.create({
      name,
      email,
      photo,
      gender,
      userId,
      dob : new Date(dob),
    });
    console.log(user);

    return res.status(200).json({
      success: true,
      message: `User ${user.name} created successfully`,
      user,
    });


  }
);
