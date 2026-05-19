import express from "express";
import { generateLearningPlan } from "../controllers/aiController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/generate-plan", protect, generateLearningPlan);

export default router;