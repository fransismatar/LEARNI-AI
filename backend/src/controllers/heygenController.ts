import { Request, Response } from "express";

export const createHeygenToken = async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.body;

    const teacherName = teacherId || "Zayed";

    const avatarId =
      process.env[`HEYGEN_${teacherName.toUpperCase()}_AVATAR_ID`] ||
      process.env.HEYGEN_AVATAR_ID;

    const voiceId =
      process.env[`HEYGEN_${teacherName.toUpperCase()}_VOICE_ID`] ||
      process.env.HEYGEN_ZAYED_VOICE_ID ||
      process.env.HEYGEN_VOICE_ID;

    if (!process.env.HEYGEN_API_KEY || !avatarId || !voiceId) {
      return res.status(400).json({
        message: "Missing HeyGen env",
        hasApiKey: Boolean(process.env.HEYGEN_API_KEY),
        avatarIdExists: Boolean(avatarId),
        voiceIdExists: Boolean(voiceId),
      });
    }

    const payload = {
      mode: "FULL",
      avatar_id: avatarId,
      avatar_persona: {
        voice_id: voiceId,
        language: "en",
      },
    };

    console.log("HEYGEN TOKEN PAYLOAD:", {
      teacherName,
      avatarId,
      voiceId,
      mode: payload.mode,
      language: payload.avatar_persona.language,
    });

    const response = await fetch("https://api.liveavatar.com/v1/sessions/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.HEYGEN_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log("HEYGEN TOKEN RESPONSE:", data);

    if (!response.ok) {
      return res.status(response.status).json({
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