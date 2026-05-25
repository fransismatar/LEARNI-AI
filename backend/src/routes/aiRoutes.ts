import express from "express";
import {
  generateLearningPlan,
  generateTeacherReply,
} from "../controllers/aiController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/generate-plan", protect, generateLearningPlan);
router.post("/teacher-reply", protect, generateTeacherReply);

export default router;