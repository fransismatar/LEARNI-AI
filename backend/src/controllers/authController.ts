import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User";
import {
  sendWelcomeEmail,
  sendResetPasswordEmail,
} from "../services/emailService";

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

const formatUser = (user: any) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  profileImage: user.profileImage,
  onboardingCompleted: user.onboardingCompleted,
  learningProfile: user.learningProfile,
  aiLearningPlan: user.aiLearningPlan,
});

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, onboardingAnswers } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and contain 1 capital letter",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      onboardingCompleted: Boolean(onboardingAnswers),
      learningProfile: onboardingAnswers || {},
    });

    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.log("Welcome email failed:", emailError);
    }

    const token = generateToken(user._id.toString());

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id.toString());

    return res.status(200).json({
      message: "Login successful",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If this email exists, a reset link was sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60);

    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
      await sendResetPasswordEmail(user.email, resetLink);
    } catch (emailError) {
      console.log("Reset password email failed:", emailError);
      return res.status(500).json({ message: "Could not send reset email" });
    }

    return res.status(200).json({ message: "Reset link sent" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and contain 1 capital letter",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  return res.status(200).json({
    user: (req as any).user,
  });
};