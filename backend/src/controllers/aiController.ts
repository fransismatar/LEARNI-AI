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

Rules:
- The plan must teach ${targetLanguage}, not always English.
- Use ${nativeLanguage} only when short explanations are helpful.
- Make the plan practical for the user's goal, level, weak points, work field, and interests.
- Vocabulary must be in ${targetLanguage}.
- Speaking prompts must make the user practice ${targetLanguage}.
- Keep the plan clear and actionable.

Return ONLY valid JSON with this structure:
{
  "summary": "short personal summary",
  "targetLanguage": "${targetLanguage}",
  "nativeLanguage": "${nativeLanguage}",
  "level": "user level",
  "dailyGoal": "daily practice recommendation",
  "weeklyPlan": [
    {
      "day": "Day 1",
      "focus": "focus title",
      "practice": "what the user should practice",
      "exampleTask": "one practical task"
    }
  ],
  "weakPoints": ["weak point 1", "weak point 2"],
  "recommendedTopics": ["topic 1", "topic 2"],
  "firstLesson": {
    "title": "lesson title",
    "conversationScenario": "scenario",
    "vocabulary": ["word 1", "word 2", "word 3"],
    "speakingPrompt": "prompt for user"
  }
}
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