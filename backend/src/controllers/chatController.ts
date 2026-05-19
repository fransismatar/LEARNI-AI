import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import OpenAI from "openai";
import User from "../models/User";
import ChatMessage from "../models/ChatMessage";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const sendChatMessage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await ChatMessage.create({
      userId,
      role: "user",
      content: message,
    });

    const previousMessages = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(12);

    const conversation = previousMessages
      .reverse()
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const profile = user.learningProfile || {};

    const targetLanguage = profile.targetLanguage || "English";
    const nativeLanguage = profile.nativeLanguage || "Arabic";

    const response = await openai.responses.create({
      model: "gpt-5.5",
      input: `
You are Learni AI, a premium AI language teacher.

Student name: ${user.name}
Student email: ${user.email}

Student learning profile:
${JSON.stringify(profile, null, 2)}

Teaching mission:
- The student wants to learn: ${targetLanguage}
- The student's native language is: ${nativeLanguage}

Rules:
- Teach mainly in ${targetLanguage}.
- Use ${nativeLanguage} only when the student is confused, asks for explanation, or writes in ${nativeLanguage}.
- If the student makes mistakes in ${targetLanguage}, correct them gently.
- Always give the corrected sentence when needed.
- Give short examples.
- Keep the answer friendly, clear, and useful.
- Do not be too long.
- Adapt to the student's level, goal, weak points, and interests.
- If the student asks in ${nativeLanguage}, answer briefly in ${nativeLanguage} and guide them back to practicing ${targetLanguage}.
- Remember the conversation history and continue like a real teacher.

Conversation history:
${conversation}

Student message:
${message}
      `,
    });

    const aiReply = response.output_text;

    await ChatMessage.create({
      userId,
      role: "assistant",
      content: aiReply,
    });

    return res.status(200).json({
      reply: aiReply,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to send chat message",
    });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const messages = await ChatMessage.find({ userId }).sort({
      createdAt: 1,
    });

    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get chat history",
    });
  }
};