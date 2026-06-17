import express from "express";
import { getMyDashboard } from "../controllers/dashboardController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/me", protect, getMyDashboard);

export default router;