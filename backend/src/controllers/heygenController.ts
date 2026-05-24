import { Request, Response } from "express";
import { buildMasterTeacherPrompt } from "../prompts/masterTeacherPrompt";

export const createHeygenToken = async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.body;

    const requestedTeacher = teacherId || "Zayed";
    const teacherName = requestedTeacher || "Zayed";

    const avatarId =
      process.env[`HEYGEN_${teacherName.toUpperCase()}_AVATAR_ID`] ||
      process.env.HEYGEN_AVATAR_ID;

    const voiceId =
      process.env[`HEYGEN_${teacherName.toUpperCase()}_VOICE_ID`] ||
      process.env.HEYGEN_ZAYED_VOICE_ID ||
      process.env.HEYGEN_VOICE_ID;

    console.log("HEYGEN DEBUG:", {
      requestedTeacher,
      teacherName,
      hasApiKey: Boolean(process.env.HEYGEN_API_KEY),
      avatarIdExists: Boolean(avatarId),
      voiceIdExists: Boolean(voiceId),
    });

    if (!process.env.HEYGEN_API_KEY || !avatarId || !voiceId) {
      return res.status(400).json({
        message: "Missing HeyGen env",
        hasApiKey: Boolean(process.env.HEYGEN_API_KEY),
        avatarIdExists: Boolean(avatarId),
        voiceIdExists: Boolean(voiceId),
      });
    }

    const user = (req as any).user;
    const profile = user?.learningProfile || {};

    const masterPrompt = buildMasterTeacherPrompt({
      teacherName,
      nativeLanguage: profile.nativeLanguage || "Arabic",
      targetLanguage: profile.targetLanguage || "English",
      level: profile.englishLevel || "Beginner",
      mainGoal: profile.mainGoal || "General conversation",
      dailyGoal: profile.dailyGoal || "10 min/day",
      profile,
    });

    const response = await fetch("https://api.liveavatar.com/v1/sessions/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.HEYGEN_API_KEY,
      },
      body: JSON.stringify({
        mode: "FULL",
        FULL: {
          avatar_id: avatarId,
          avatar_persona: {
            name: teacherName,
            prompt: masterPrompt,
            voice_id: voiceId,
          },
        },
      }),
    });

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
    console.log("LiveAvatar server error:", error);

    return res.status(500).json({
      message: "LiveAvatar server error",
    });
  }
};