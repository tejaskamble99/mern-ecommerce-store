import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";

export const newUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });

    return res
      .status(200)
      .json({
        success: true,
        message: `User ${user.name} created successfully`,
        user,
      });
  } catch (error) {}
};
