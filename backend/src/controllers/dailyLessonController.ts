import { Request, Response } from "express";
import OpenAI from "openai";
import User from "../models/User";
import DailyLesson from "../models/DailyLesson";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const todayKey = () => new Date().toISOString().slice(0, 10);

export const getTodayLesson = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const date = todayKey();

    let dailyLesson = await DailyLesson.findOne({ userId, date });

    if (!dailyLesson) {
      const user = await User.findById(userId).select("-password");
      const profile = user?.learningProfile || {};

      const response = await openai.responses.create({
        model: "gpt-5.5",
        input: `
Create one daily language lesson.

Student profile:
${JSON.stringify(profile, null, 2)}

Return ONLY valid JSON:
{
  "topic": "",
  "level": "",
  "speakingTask": "",
  "words": ["", "", "", "", ""],
  "storyTask": "",
  "quiz": {
    "question": "",
    "options": ["", "", "", ""],
    "answer": ""
  }
}
        `,
      });

      const lessonData = JSON.parse(response.output_text || "{}");

      dailyLesson = await DailyLesson.create({
        userId,
        date,
        topic: lessonData.topic || "Daily English Practice",
        level: lessonData.level || profile.level || "Beginner",
        speakingTask: lessonData.speakingTask || "Practice a short conversation.",
        words: lessonData.words || [],
        storyTask: lessonData.storyTask || "Read a short story and explain it.",
        quiz: lessonData.quiz || {},
      });
    }

    return res.status(200).json({ dailyLesson });
  } catch (error) {
    console.log("DAILY LESSON ERROR:", error);
    return res.status(500).json({ message: "Failed to load daily lesson" });
  }
};

export const completeDailyTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const task = String(req.params.task);

    if (!["speaking", "words", "story", "quiz"].includes(task)) {
      return res.status(400).json({ message: "Invalid task" });
    }

    const date = todayKey();

    const dailyLesson = await DailyLesson.findOneAndUpdate(
      { userId, date },
      { $set: { [`completed.${task}`]: true } },
      { new: true }
    );

    if (!dailyLesson) {
      return res.status(404).json({ message: "Daily lesson not found" });
    }

    return res.status(200).json({
      message: "Task completed",
      dailyLesson,
    });
  } catch (error) {
    console.log("COMPLETE DAILY TASK ERROR:", error);
    return res.status(500).json({ message: "Failed to complete task" });
  }
};