import express from "express";
import {
  getTodayLesson,
  completeDailyTask,
} from "../controllers/dailyLessonController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/today", protect, getTodayLesson);
router.put("/complete/:task", protect, completeDailyTask);

export default router;