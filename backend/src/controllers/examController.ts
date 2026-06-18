import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import OpenAI from "openai";
import User from "../models/User";
import DailyLesson from "../models/DailyLesson";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const todayKey = () => new Date().toISOString().slice(0, 10);

const shuffleArray = (array: string[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const generateExam = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { topic, mode } = req.body;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = user.learningProfile || {};
    const targetLanguage = profile.targetLanguage || "English";
    const nativeLanguage = profile.nativeLanguage || "Arabic";
    const level = profile.englishLevel || profile.level || "Beginner";
    const goal = profile.mainGoal || profile.goal || "Speaking confidence";

    let examSource = "";

    if (mode === "daily") {
      const dailyLesson = await DailyLesson.findOne({
        userId,
        date: todayKey(),
      });

      if (!dailyLesson) {
        return res.status(404).json({
          message: "Daily lesson not found. Please open today's lesson first.",
        });
      }

      examSource = `
Create the exam ONLY from today's lesson:

Topic: ${dailyLesson.topic}
Level: ${dailyLesson.level}
Speaking task: ${dailyLesson.speakingTask}
Words: ${dailyLesson.words.join(", ")}
Story task: ${dailyLesson.storyTask}
Quiz question: ${dailyLesson.quiz?.question}
Quiz answer: ${dailyLesson.quiz?.answer}
`;
    } else {
      examSource = `
Create the exam about this custom topic:
${topic || "general daily English"}
`;
    }

    const response = await openai.responses.create({
      model: "gpt-5.5",
      input: `
You are Lerni AI, a professional language exam creator.

Student:
- Name: ${user.name}
- Target language: ${targetLanguage}
- Native language: ${nativeLanguage}
- Level: ${level}
- Main goal: ${goal}

${examSource}

Rules:
- Create exactly 10 multiple-choice questions.
- Each question must have exactly 4 options.
- Only one correct answer.
- Questions must match the student's level.
- Use practical language, grammar, vocabulary, and real-life usage.
- If mode is daily, test ONLY what exists in today's lesson.
- Return ONLY valid JSON.
- No markdown.
- No explanation outside JSON.

JSON format:
{
  "title": "string",
  "level": "string",
  "topic": "string",
  "questions": [
    {
      "id": 1,
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": "string"
    }
  ]
}
      `,
    });

    let exam;

    try {
      exam = JSON.parse(response.output_text || "{}");

      exam.questions = exam.questions.map((question: any) => ({
        ...question,
        options: shuffleArray(question.options),
      }));
    } catch (error) {
      return res.status(500).json({
        message: "AI returned invalid exam format",
      });
    }

    return res.status(200).json({ exam });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to generate exam",
    });
  }
};

export const submitExam = async (req: Request, res: Response) => {
  try {
    const { questions, answers } = req.body;

    if (!questions || !answers) {
      return res.status(400).json({
        message: "Questions and answers are required",
      });
    }

    let correctCount = 0;

    const results = questions.map((question: any) => {
      const studentAnswer = answers[question.id];
      const isCorrect = studentAnswer === question.answer;

      if (isCorrect) correctCount += 1;

      return {
        id: question.id,
        question: question.question,
        correctAnswer: question.answer,
        studentAnswer,
        isCorrect,
      };
    });

    const total = questions.length;
    const score = Math.round((correctCount / total) * 100);

    return res.status(200).json({
      score,
      correctCount,
      total,
      results,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to submit exam",
    });
  }
};