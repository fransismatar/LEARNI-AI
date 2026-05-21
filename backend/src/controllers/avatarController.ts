import { Request, Response } from "express";
import { buildMasterTeacherPrompt } from "../prompts/masterTeacherPrompt";

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

    const masterPrompt = buildMasterTeacherPrompt({
      teacherName: teacherId || "Maya",
      nativeLanguage,
      targetLanguage,
      level,
      mainGoal,
      dailyGoal,
      profile,
    });

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
        conversational_context: masterPrompt,
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
        }),
      }
    );

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