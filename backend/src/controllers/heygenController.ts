import { Request, Response } from "express";
import { buildMasterTeacherPrompt } from "../prompts/masterTeacherPrompt";

export const createHeygenToken = async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.body;

    const teacherAvatars: Record<string, string | undefined> = {
      Zayed: process.env.HEYGEN_AVATAR_ID,
      Zyron: process.env.HEYGEN_ZYRON_AVATAR_ID,
      Noor: process.env.HEYGEN_NOOR_AVATAR_ID,
      Sophia: process.env.HEYGEN_SOPHIA_AVATAR_ID,
      Maya: process.env.HEYGEN_MAYA_AVATAR_ID,
      Adam: process.env.HEYGEN_ADAM_AVATAR_ID,
      Stephanie: process.env.HEYGEN_STEPHANIE_AVATAR_ID,
    };

    const teacherVoices: Record<string, string | undefined> = {
      Zayed: process.env.HEYGEN_ZAYED_VOICE_ID,
      Zyron: process.env.HEYGEN_ZYRON_VOICE_ID,
      Noor: process.env.HEYGEN_NOOR_VOICE_ID,
      Sophia: process.env.HEYGEN_SOPHIA_VOICE_ID,
      Maya: process.env.HEYGEN_MAYA_VOICE_ID,
      Adam: process.env.HEYGEN_ADAM_VOICE_ID,
      Stephanie: process.env.HEYGEN_STEPHANIE_VOICE_ID,
    };

    const requestedTeacher = teacherId || "Zayed";

    const teacherName =
      teacherAvatars[requestedTeacher] && teacherVoices[requestedTeacher]
        ? requestedTeacher
        : "Zayed";

    const avatarId =
      teacherAvatars[teacherName] || process.env.HEYGEN_AVATAR_ID;

    const voiceId =
      teacherVoices[teacherName] || process.env.HEYGEN_ZAYED_VOICE_ID;

    console.log("HEYGEN DEBUG:", {
      requestedTeacher,
      teacherName,
      hasApiKey: Boolean(process.env.HEYGEN_API_KEY),
      avatarIdExists: Boolean(avatarId),
      voiceIdExists: Boolean(voiceId),
    });

    if (!process.env.HEYGEN_API_KEY) {
      return res.status(500).json({
        message: "Missing HEYGEN_API_KEY",
      });
    }

    if (!avatarId || !voiceId) {
      return res.status(400).json({
        message: "Missing avatar_id or voice_id",
        requestedTeacher,
        teacherName,
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

    // التعديل الجوهري هنا: إرسال الكائن بالصيغة التي تطلبها خوادم HeyGen تماماً
    const response = await fetch("https://api.liveavatar.com/v1/sessions/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.HEYGEN_API_KEY,
      },
      body: JSON.stringify({
        FULL: {
          avatar_id: avatarId,
          voice_id: voiceId,
          avatar_persona: {
            name: teacherName,
            prompt: masterPrompt,
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

    // هنا نمرر الـ data بالكامل لأن HeyGen سيعيد كائن يحتوي على التوكن بالداخل
    return res.status(200).json({ data: data.data || data });
  } catch (error) {
    console.log("LiveAvatar server error:", error);

    return res.status(500).json({
      message: "LiveAvatar server error",
    });
  }
};