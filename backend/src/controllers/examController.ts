import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import OpenAI from "openai";
import User from "../models/User";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateExam = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { topic } = req.body;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = user.learningProfile || {};

    const targetLanguage = profile.targetLanguage || "English";
    const nativeLanguage = profile.nativeLanguage || "Arabic";
    const level = profile.englishLevel || profile.level || "Beginner";
    const goal = profile.mainGoal || profile.goal || "Speaking confidence";

    const response = await openai.responses.create({
      model: "gpt-5.5",
      input: `
You are Lerni AI, a professional language exam creator.

Create a short exam for this student.

Student:
- Name: ${user.name}
- Target language: ${targetLanguage}
- Native language: ${nativeLanguage}
- Level: ${level}
- Main goal: ${goal}
- Requested topic: ${topic || "general daily English"}

Rules:
- Create exactly 10 multiple-choice questions.
- Each question must have exactly 4 options.
- Only one correct answer.
- Questions should match the student's level.
- Focus on practical language, grammar, vocabulary, and real-life usage.
- Do not make the exam too hard.
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

    const text = response.output_text;

    let exam;

    try {
      exam = JSON.parse(text);
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

      if (isCorrect) {
        correctCount += 1;
      }

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