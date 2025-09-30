import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { newUserRequestBody } from "../types/types.js";

export const newUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, photo, gender, _id, dob } = req.body;

    const user = await User.create({
      name,
      email,
      photo,
      gender,
      _id,
      dob : new Date(dob),
    });
    console.log(user);

    return res.status(200).json({
      success: true,
      message: `User ${user.name} created successfully`,
      user,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: `error`,
    });
  }
};
