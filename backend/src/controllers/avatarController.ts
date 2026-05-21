import { Request, Response } from "express";

const teachers: Record<
  string,
  {
    replicaId: string;
    personaId: string;
  }
> = {
  Maya: {
    replicaId: "r1e52660d3bf",
    personaId: "pcfc521175c1",
  },

  Adam: {
    replicaId: "r5f0577fc829",
    personaId: "pec4fcbacbee",
  },

  Stephanie: {
    replicaId: "rcc28da86847",
    personaId: "p692268dd14e",
  },

  Noor: {
    replicaId: "rad9d862ec86",
    personaId: "p41d63348338",
  },

  Sophia: {
    replicaId: "r26aa0662080",
    personaId: "p58b9b2fac50",
  },
};

const languageInstruction = (
  nativeLanguage: string,
  targetLanguage: string
) => {
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

    const selectedTeacher = teachers[teacherId] || teachers.Maya;

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
        replica_id: selectedTeacher.replicaId,
        persona_id: selectedTeacher.personaId,
        conversation_name: `Learni AI - ${teacherId || "Maya"}`,
        conversational_context: `
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

export const speakWithAvatar = async (req: Request, res: Response) => {
  try {
    const { conversationId, text } = req.body;

    if (!conversationId || !text) {
      return res.status(400).json({
        message: "conversationId and text are required",
      });
    }

    const response = await fetch(
      `https://tavusapi.com/v2/conversations/${conversationId}/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.TAVUS_API_KEY || "",
        },
       body: JSON.stringify({
  message_type: "conversation",
  event_type: "conversation.echo",
  conversation_id: conversationId,
  properties: {
    modality: "text",
    text,
  },
}),})

    const data = await response.json();

    if (!response.ok) {
      console.log("Tavus speak error:", data);

      return res.status(400).json({
        message: "Tavus failed to speak",
        details: data,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to speak with avatar",
    });
  }
};