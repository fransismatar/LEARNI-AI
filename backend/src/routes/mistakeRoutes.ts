import express from "express";
import {
  getMyMistakes,
  markMistakeReviewed,
} from "../controllers/mistakeController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getMyMistakes);
router.put("/:mistakeId/review", protect, markMistakeReviewed);

export default router;