import express from "express";
import { generateExam, submitExam } from "../controllers/examController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/generate", protect, generateExam);
router.post("/submit", protect, submitExam);

export default router;