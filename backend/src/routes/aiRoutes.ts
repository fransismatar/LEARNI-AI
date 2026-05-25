import express from "express";
import multer from "multer";
import {
  generateLearningPlan,
  generateTeacherReply,
  transcribeVoice,
} from "../controllers/aiController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/generate-plan", protect, generateLearningPlan);
router.post("/teacher-reply", protect, generateTeacherReply);
router.post("/transcribe-voice", protect, upload.single("audio"), transcribeVoice);

export default router;