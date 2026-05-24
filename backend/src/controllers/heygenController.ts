import { Request, Response } from "express";

export const createHeygenToken = async (req: Request, res: Response) => {
  try {
    if (!process.env.HEYGEN_API_KEY) {
      return res.status(500).json({
        message: "Missing HEYGEN_API_KEY",
      });
    }

    const response = await fetch(
      "https://api.heygen.com/v1/streaming.create_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.HEYGEN_API_KEY,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("HeyGen token error:", data);

      return res.status(response.status).json({
        message: "Failed to create HeyGen token",
        details: data,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log("HeyGen server error:", error);

    return res.status(500).json({
      message: "HeyGen server error",
    });
  }
};