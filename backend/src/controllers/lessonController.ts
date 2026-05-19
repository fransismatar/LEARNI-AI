import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import OpenAI from "openai";
import User from "../models/User";
import Lesson from "../models/Lesson";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateLessons = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = user.learningProfile || {};

    const targetLanguage = profile.targetLanguage || "English";
    const nativeLanguage = profile.nativeLanguage || "Arabic";

    const response = await openai.responses.create({
      model: "gpt-5.5",
      input: `
Create 5 personalized language lessons for this student.

Student:
Name: ${user.name}

The student wants to learn: ${targetLanguage}
The student's native language is: ${nativeLanguage}

Profile:
${JSON.stringify(profile, null, 2)}

Rules:
- Lessons must teach ${targetLanguage}, not always English.
- Use ${nativeLanguage} only for short explanations if needed.
- Match the student's level, goal, work field, interests, and weak points.
- Make lessons practical and useful.
- Vocabulary must be in ${targetLanguage}.
- Speaking prompts must ask the student to practice ${targetLanguage}.
- Example conversations must be in ${targetLanguage}.
- Keep the lessons beginner-friendly if the student level is low.

Return ONLY valid JSON array:
[
  {
    "title": "",
    "description": "",
    "level": "",
    "vocabulary": ["", "", ""],
    "grammarFocus": "",
    "speakingPrompt": "",
    "exampleConversation": [
      { "speaker": "Teacher", "text": "" },
      { "speaker": "Student", "text": "" }
    ],
    "xpReward": 20
  }
]
      `,
    });

    const lessons = JSON.parse(response.output_text);

    await Lesson.deleteMany({ userId });

    const createdLessons = await Lesson.insertMany(
      lessons.map((lesson: any) => ({
        ...lesson,
        userId,
      }))
    );

    return res.status(201).json({
      message: "Lessons generated successfully",
      lessons: createdLessons,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to generate lessons",
    });
  }
};

export const getMyLessons = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const lessons = await Lesson.find({ userId }).sort({ createdAt: 1 });

    return res.status(200).json({ lessons });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get lessons",
    });
  }
};

export const completeLesson = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { lessonId } = req.params;

    const lesson = await Lesson.findOneAndUpdate(
      { _id: lessonId, userId },
      { completed: true },
      { new: true }
    );

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    return res.status(200).json({
      message: "Lesson completed",
      lesson,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to complete lesson",
    });
  }
};