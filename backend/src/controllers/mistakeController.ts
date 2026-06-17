import { Request, Response } from "express";
import Mistake from "../models/Mistake";

export const getMyMistakes = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const mistakes = await Mistake.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({ mistakes });
  } catch (error) {
    console.log("GET MISTAKES ERROR:", error);
    return res.status(500).json({ message: "Failed to get mistakes" });
  }
};

export const markMistakeReviewed = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { mistakeId } = req.params;

    const mistake = await Mistake.findOneAndUpdate(
      { _id: mistakeId, userId },
      { reviewed: true },
      { new: true }
    );

    if (!mistake) {
      return res.status(404).json({ message: "Mistake not found" });
    }

    return res.status(200).json({
      message: "Mistake reviewed",
      mistake,
    });
  } catch (error) {
    console.log("REVIEW MISTAKE ERROR:", error);
    return res.status(500).json({ message: "Failed to review mistake" });
  }
};