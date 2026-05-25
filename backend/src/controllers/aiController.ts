import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import OpenAI from "openai";
import User from "../models/User";
import { buildMasterTeacherPrompt } from "../prompts/masterTeacherPrompt";
import { toFile } from "openai/uploads";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateLearningPlan = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const fullUser = await User.findById(user._id).select("-password");

    if (!fullUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = fullUser.learningProfile;

    if (!profile) {
      return res.status(400).json({
        message: "Please complete onboarding first",
      });
    }

    const targetLanguage = profile.targetLanguage || "English";
    const nativeLanguage = profile.nativeLanguage || "Arabic";

    const response = await openai.responses.create({
      model: "gpt-5.5",
      input: `
Create a personalized language learning plan.

The user wants to learn: ${targetLanguage}
The user's native language is: ${nativeLanguage}

User profile:
${JSON.stringify(profile, null, 2)}

Return ONLY valid JSON.
      `,
    });

    const text = response.output_text;
    const plan = JSON.parse(text);

    fullUser.aiLearningPlan = plan;
    await fullUser.save();

    return res.status(200).json({
      message: "AI learning plan generated",
      plan,
    });
  } catch (error) {
    console.log("GENERATE PLAN ERROR:", error);

    return res.status(500).json({
      message: "Failed to generate AI plan",
    });
  }
};

export const transcribeVoice = async (req: Request, res: Response) => {
  try {
    const audioFile = req.file;

    if (!audioFile) {
      return res.status(400).json({
        message: "Audio file is required",
      });
    }

    const file = await toFile(audioFile.buffer, "voice.webm", {
      type: audioFile.mimetype || "audio/webm",
    });

    const transcription = await openai.audio.transcriptions.create({
      model: "gpt-4o-mini-transcribe",
      file,
    });

    return res.status(200).json({
      text: transcription.text,
    });
  } catch (error) {
    console.log("TRANSCRIBE ERROR:", error);

    return res.status(500).json({
      message: "Failed to transcribe voice",
    });
  }
};

export const generateTeacherReply = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const {
      message,
      teacherName = "Zayed",
      profile: frontendProfile = {},
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const fullUser = await User.findById(user._id).select("-password");

    if (!fullUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const dbProfile = fullUser.learningProfile || {};

    const profile = {
      ...frontendProfile,
      ...dbProfile,
    };

    const targetLanguage = profile.targetLanguage || "English";
    const nativeLanguage = profile.nativeLanguage || "Arabic";
    const level = profile.englishLevel || profile.level || "Beginner";
    const mainGoal = profile.mainGoal || "General conversation";
    const dailyGoal = profile.dailyGoal || "10 min/day";

    const systemPrompt = buildMasterTeacherPrompt({
      teacherName,
      nativeLanguage,
      targetLanguage,
      level,
      mainGoal,
      dailyGoal,
      profile,
    });

    const response = await openai.responses.create({
      model: "gpt-5.5",
      input: `
${systemPrompt}

CURRENT STUDENT MESSAGE:
"${message}"

IMPORTANT RESPONSE RULES:
- Return only the teacher spoken reply.
- Do not use markdown.
- Do not use bullet points.
- Do not write numbered lists.
- Speak naturally for a live avatar.
- Give 2 to 3 short spoken sentences.
- Always answer the student's direct question first.
- If the student asks for meaning, translation, or says "what does it mean", answer the meaning first in the student's native language.
- After answering the meaning, return to the same lesson with one small practice sentence.
- Always teach something useful from the student's goal.
- If the student asks something outside the lesson, answer briefly then return to the lesson.
- End with one simple practice question.
      `,
    });

    return res.status(200).json({
      reply:
        response.output_text?.trim() ||
        "Great, let's continue your lesson. Repeat after me: I am ready to learn.",
    });
  } catch (error) {
    console.log("TEACHER REPLY ERROR:", error);

    return res.status(500).json({
      message: "Failed to generate teacher reply",
    });
  }
};