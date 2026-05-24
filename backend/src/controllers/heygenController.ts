import { Request, Response } from "express";
import { buildMasterTeacherPrompt } from "../prompts/masterTeacherPrompt";

const teacherAvatars: Record<string, string | undefined> = {
  Zayed: process.env.HEYGEN_ZAYED_AVATAR_ID,
  Zyron: process.env.HEYGEN_ZYRON_AVATAR_ID,
  Noor: process.env.HEYGEN_NOOR_AVATAR_ID,
  Sophia: process.env.HEYGEN_SOPHIA_AVATAR_ID,
  Maya: process.env.HEYGEN_MAYA_AVATAR_ID,
  Adam: process.env.HEYGEN_ADAM_AVATAR_ID,
  Stephanie: process.env.HEYGEN_STEPHANIE_AVATAR_ID,
};

export const createHeygenToken = async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.body;

    const user = (req as any).user;
    const profile = user?.learningProfile || {};

    const nativeLanguage = profile.nativeLanguage || "Arabic";
    const targetLanguage = profile.targetLanguage || "English";
    const level = profile.englishLevel || "Beginner";
    const mainGoal = profile.mainGoal || "General conversation";
    const dailyGoal = profile.dailyGoal || "10 min/day";

    const teacherName = teacherId || "Zayed";

    const avatarId =
  teacherAvatars[teacherName] ||
  process.env.HEYGEN_ZAYED_AVATAR_ID ||
  process.env.HEYGEN_AVATAR_ID;

    const masterPrompt = buildMasterTeacherPrompt({
      teacherName,
      nativeLanguage,
      targetLanguage,
      level,
      mainGoal,
      dailyGoal,
      profile,
    });

    const response = await fetch(
      "https://api.liveavatar.com/v1/sessions/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.HEYGEN_API_KEY || "",
        },
        body: JSON.stringify({
          mode: "FULL",
          avatar_id: avatarId,
          avatar_persona: {
            name: teacherName,
            prompt: masterPrompt,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("LiveAvatar token error:", data);

      return res.status(400).json({
        message: "Failed to create LiveAvatar token",
        details: data,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "LiveAvatar server error",
    });
  }
};