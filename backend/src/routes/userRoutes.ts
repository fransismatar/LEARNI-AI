import express from "express";
import { updateLearningProfile } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.put("/learning-profile", protect, updateLearningProfile);

export default router;