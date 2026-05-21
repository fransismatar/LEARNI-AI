import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  createAvatarSession,
  speakWithAvatar,
} from "../controllers/avatarController";

const router = express.Router();

router.post("/session", protect, createAvatarSession);
router.post("/speak", protect, speakWithAvatar);

export default router;