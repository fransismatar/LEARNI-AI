import { Request, Response } from "express";

export const createAvatarSession = async (
  req: Request,
  res: Response
) => {
  try {
    const response = await fetch(
      "https://tavusapi.com/v2/conversations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.TAVUS_API_KEY || "",
        },
        body: JSON.stringify({
          replica_id: process.env.TAVUS_REPLICA_ID,
          conversation_name: "Learni AI Teacher",
          conversational_context:
            "You are an English teacher helping students practice English naturally.",
        }),
      }
    );

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to create Tavus conversation",
    });
  }
};