import express from "express";
import {
  updateLearningProfile,
  updateProfile,
} from "../controllers/userController";

import { protect } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();

router.put("/learning-profile", protect, updateLearningProfile);

router.put("/profile", protect, upload.single("profileImage"), updateProfile);

export default router;