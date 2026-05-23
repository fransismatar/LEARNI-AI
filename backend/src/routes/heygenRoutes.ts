import express from "express";
import { protect } from "../middleware/authMiddleware";
import { createHeygenToken } from "../controllers/heygenController";

const router = express.Router();

router.post("/token", protect, createHeygenToken);

export default router;