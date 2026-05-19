import { Request, Response } from "express";
import User from "../models/User";
import Lesson from "../models/Lesson";

export const updateLearningProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const { nativeLanguage, targetLanguage } = req.body;

    if (!nativeLanguage || !targetLanguage) {
      return res.status(400).json({
        message: "Native language and target language are required",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.learningProfile = {
      ...(user.learningProfile || {}),
      nativeLanguage,
      targetLanguage,
    };

    user.aiLearningPlan = null;

    await user.save();

    await Lesson.deleteMany({ userId });

    return res.status(200).json({
      message: "Learning profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to update learning profile",
    });
  }
};