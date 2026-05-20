import { Request, Response } from "express";

const teachers: Record<string, string> = {
  "Learni-X":
    "You are Learni-X, a friendly and smart private language teacher. You are warm, clear, patient, and you push the student to speak more.",
  Maya:
    "You are Maya, a calm and supportive language coach. You explain slowly, make the student feel safe, and build confidence step by step.",
  Adam:
    "You are Adam, a professional speaking coach. You focus on pronunciation, fluency, interviews, work conversations, and strong corrections.",
};

const languageInstruction = (nativeLanguage: string, targetLanguage: string) => {
  return `
Language rules:
- The student's native language is ${nativeLanguage}.
- The student wants to learn ${targetLanguage}.
- Speak mostly in ${targetLanguage} for practice.
- When the student is confused, explain in ${nativeLanguage}.
- If native language is Arabic, explain clearly in Arabic, but keep practice sentences in ${targetLanguage}.
- Correct mistakes gently.
- After correction, ask the student to repeat the correct sentence.
- Do not give long lectures.
- Make the lesson feel like a real 1-on-1 teacher video call.
`;
};

export const createAvatarSession = async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.body;

    const selectedPrompt = teachers[teacherId] || teachers["Learni-X"];

    const user = (req as any).user;
    const profile = user?.learningProfile || {};

    const nativeLanguage = profile.nativeLanguage || "Arabic";
    const targetLanguage = profile.targetLanguage || "English";
    const level = profile.englishLevel || "Beginner";
    const mainGoal = profile.mainGoal || "General conversation";
    const dailyGoal = profile.dailyGoal || "10 min/day";

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

Student profile:
- Name: ${user?.name || "Student"}
- Native language: ${nativeLanguage}
- Target language: ${targetLanguage}
- Level: ${level}
- Main goal: ${mainGoal}
- Daily practice goal: ${dailyGoal}

${languageInstruction(nativeLanguage, targetLanguage)}

Lesson flow:
1. Start with a short welcome in the student's native language.
2. Ask one simple question in ${targetLanguage}.
3. Let the student answer.
4. Correct grammar, pronunciation, or vocabulary.
5. Explain the correction in ${nativeLanguage} if needed.
6. Give the student a better sentence.
7. Ask the student to repeat.
8. Continue with short realistic conversation.

Important teaching style:
- Be natural, not robotic.
- Use short questions.
- Do not speak too much.
- Always make the student talk.
- If the student answers in ${nativeLanguage}, help them say it in ${targetLanguage}.
- Give encouragement after each answer.
- End each small practice with a quick summary.
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