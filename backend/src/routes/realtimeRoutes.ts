import express from "express";
import { createRealtimeSession } from "../controllers/realtimeController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/session", protect, createRealtimeSession);

export default router;