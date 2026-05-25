import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import OpenAI from "openai";
import User from "../models/User";

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
    console.log(error);

    return res.status(500).json({
      message: "Failed to generate AI plan",
    });
  }
};

export const generateTeacherReply = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { message, teacherName = "Zayed", profile: frontendProfile } = req.body;

    const fullUser = await User.findById(user._id).select("-password");

    if (!fullUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = fullUser.learningProfile || frontendProfile || {};

    const targetLanguage = profile.targetLanguage || "English";
    const nativeLanguage = profile.nativeLanguage || "Arabic";
    const level = profile.englishLevel || profile.level || "Beginner";
    const mainGoal = profile.mainGoal || "General conversation";

    const response = await openai.responses.create({
      model: "gpt-5.5",
      input: `
You are ${teacherName}, a live AI language teacher from Lerni AI.

Student profile:
${JSON.stringify(profile, null, 2)}

Student message:
"${message}"

Rules:
- You are teaching ${targetLanguage}.
- The student's native language is ${nativeLanguage}.
- The student's level is ${level}.
- The student's main goal is ${mainGoal}.
- Do NOT repeat the student's message.
- Do NOT translate only.
- Lead the lesson like a real teacher.
- If the student says "ready", "yes", "ok", "ابدأ", "جاهز", start Lesson 1 immediately.
- If the goal is Travel, teach airport/hotel/restaurant/directions/shopping/emergency phrases.
- If the goal is Career, teach interview/meeting/email/coworker phrases.
- If the goal is Study, teach exam/class/academic phrases.
- If the goal is Business, teach client/sales/negotiation/networking phrases.
- Correct grammar and vocabulary mistakes gently.
- Keep response short: 1-3 spoken sentences.
- Ask one simple question or practice task at the end.

Return only the teacher's spoken reply.
      `,
    });

    return res.status(200).json({
      reply: response.output_text,
    });
  } catch (error) {
    console.log("TEACHER REPLY ERROR:", error);

    return res.status(500).json({
      message: "Failed to generate teacher reply",
    });
  }
};