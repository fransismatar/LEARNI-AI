import express from "express";
import {
  sendChatMessage,
  getChatHistory,
} from "../controllers/chatController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/message", protect, sendChatMessage);
router.get("/history", protect, getChatHistory);

export default router;