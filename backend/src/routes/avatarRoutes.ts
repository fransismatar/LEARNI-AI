import express from "express";
import { protect } from "../middleware/authMiddleware";
import { createAvatarSession } from "../controllers/avatarController";

const router = express.Router();

router.post("/session", protect, createAvatarSession);

export default router;