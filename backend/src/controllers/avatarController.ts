import { Request, Response } from "express";

const teachers: Record<string, string> = {
  "Learni-X":
    "You are Learni-X, a friendly AI language teacher. Teach clearly, correct mistakes kindly, and make the student speak more.",
  Maya:
    "You are Maya, a calm conversation coach. Help the student feel confident, explain slowly, and use simple examples.",
  Adam:
    "You are Adam, a professional speaking coach. Focus on pronunciation, interviews, work conversations, and strong corrections.",
};

export const createAvatarSession = async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.body;

    const selectedPrompt =
      teachers[teacherId] || teachers["Learni-X"];

    const user = (req as any).user;
    const profile = user?.learningProfile || {};

    const response = await fetch("https://tavusapi.com/v2/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.TAVUS_API_KEY || "",
      },
      body: JSON.stringify({
        replica_id: process.env.TAVUS_REPLICA_ID,
        conversation_name: `Learni AI - ${teacherId || "Learni-X"}`,
        conversational_context: `
${selectedPrompt}

Student native language: ${profile.nativeLanguage || "Unknown"}
Target language: ${profile.targetLanguage || "English"}
Student level: ${profile.englishLevel || "Beginner"}
Main goal: ${profile.mainGoal || "General speaking"}

Important:
- Explain difficult things in the student's native language when needed.
- Practice mostly in the target language.
- Correct grammar and pronunciation naturally.
- Ask short questions.
- Make the lesson feel like a real private teacher.
        `,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
  console.log("Tavus error:", data);
  return res.status(400).json({
    message: "Tavus failed to create conversation",
    details: data,
  });
}

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to create Tavus conversation",
    });
  }
};