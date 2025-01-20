import { z } from "zod";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

const signupBody = z.object({
  name: z
    .string()
    .max(30, "Name can not exceed 30 characters")
    .min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .max(30, "Password can not exceed 30 characters")
    .min(8, "Password must be at least 8 characters long"),
});

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const result = signupBody.safeParse({
    name,
    email,
    password,
  });

  if (!result.success) {
    console.log("Validation failed: ", result.data);
    res.status(400).json({
      message: result.error.errors,
    });
    return;
  }

  const user = await User.findOne({ email });
  if (user) {
    res.status(411).json({
      message: "User already exists",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const userId = newUser._id;
  const token = jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET as string
  );

  res.status(200).json({
    token,
    message: "Sign up successfull",
  });
};

const signinBody = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = signinBody.safeParse({ email, password });

  if (!result.success) {
    res.status(400).json({
      message: result.error.errors,
    });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({
      message: "Invalid credentials",
    });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400).json({
      message: "Invalid credentials",
    });
    return;
  }

  const token = jwt.sign(
    { userId: user?._id },
    process.env.JWT_SECRET as string
  );

  res.status(200).json({
    message: "Sign In successfull",
    token,
  });
};
