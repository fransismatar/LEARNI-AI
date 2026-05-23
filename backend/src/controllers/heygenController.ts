import { Request, Response } from "express";

export const createHeygenToken = async (req: Request, res: Response) => {
  try {
    const response = await fetch(
      "https://api.liveavatar.com/v1/sessions/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.HEYGEN_API_KEY || "",
        },
        body: JSON.stringify({
          mode: "FULL",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("LiveAvatar token error:", data);

      return res.status(400).json({
        message: "Failed to create LiveAvatar token",
        details: data,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "LiveAvatar server error",
    });
  }
};