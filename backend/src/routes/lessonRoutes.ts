import express from "express";
import {
  generateLessons,
  getMyLessons,
  completeLesson,
} from "../controllers/lessonController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/generate", protect, generateLessons);
router.get("/", protect, getMyLessons);
router.put("/:lessonId/complete", protect, completeLesson);

export default router;