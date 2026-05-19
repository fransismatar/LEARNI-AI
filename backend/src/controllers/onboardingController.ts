import { Request, Response } from "express";
import User from "../models/User";

export const saveOnboarding = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const {
      nativeLanguage,
      targetLanguage,
      goal,
      level,
      dailyMinutes,
      learningStyle,
      mainWeakness,
      preferredTopics,
    } = req.body;

    if (
      !nativeLanguage ||
      !targetLanguage ||
      !goal ||
      !level ||
      !dailyMinutes ||
      !learningStyle ||
      !mainWeakness
    ) {
      return res.status(400).json({
        message: "Please answer all required questions",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        onboardingCompleted: true,
        learningProfile: {
          nativeLanguage,
          targetLanguage,
          goal,
          level,
          dailyMinutes,
          learningStyle,
          mainWeakness,
          preferredTopics: preferredTopics || [],
        },
      },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Onboarding saved successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};