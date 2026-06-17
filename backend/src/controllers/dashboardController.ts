import { Request, Response } from "express";
import Lesson from "../models/Lesson";
import Mistake from "../models/Mistake";

export const getMyDashboard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const lessons = await Lesson.find({ userId }).sort({ createdAt: 1 });
    const mistakesCount = await Mistake.countDocuments({
      userId,
      reviewed: false,
    });

    const completedLessons = lessons.filter((lesson) => lesson.completed).length;
    const totalLessons = lessons.length;

    const speakingScore =
      totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

    const currentLesson =
      lessons.find((lesson) => !lesson.completed) || lessons[lessons.length - 1];

    return res.status(200).json({
      speakingScore,
      mistakesCount,
      currentTopic: currentLesson?.title || "Start your first lesson",
      currentDescription:
        currentLesson?.description || "Generate your first AI lesson.",
      completedLessons,
      totalLessons,
      currentLesson,
    });
  } catch (error) {
    console.log("DASHBOARD ERROR:", error);

    return res.status(500).json({
      message: "Failed to load dashboard",
    });
  }
};