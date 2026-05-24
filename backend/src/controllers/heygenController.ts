import { Request, Response } from "express";
import { buildMasterTeacherPrompt } from "../prompts/masterTeacherPrompt";

const teacherAvatars: Record<string, string> = {
  Zayed: "da22349c-2233-441c-864d-b0d1c766b6e0",

  // مؤقتًا كلهم يستخدمون Zayed لحد ما تعمل avatars جديدة
  Zyron: "da22349c-2233-441c-864d-b0d1c766b6e0",
  Noor: "da22349c-2233-441c-864d-b0d1c766b6e0",
  Sophia: "da22349c-2233-441c-864d-b0d1c766b6e0",
  Maya: "da22349c-2233-441c-864d-b0d1c766b6e0",
  Adam: "da22349c-2233-441c-864d-b0d1c766b6e0",
  Stephanie: "da22349c-2233-441c-864d-b0d1c766b6e0",
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
      teacherAvatars[teacherName] || teacherAvatars.Zayed;

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