import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import onboardingRoutes from "./routes/onboardingRoutes";
import aiRoutes from "./routes/aiRoutes";
import chatRoutes from "./routes/chatRoutes";
import realtimeRoutes from "./routes/realtimeRoutes";
import lessonRoutes from "./routes/lessonRoutes";
import avatarRoutes from "./routes/avatarRoutes";
import userRoutes from "./routes/userRoutes";
import connectDB from "./config/db";
import heygenRoutes from "./routes/heygenRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import mistakeRoutes from "./routes/mistakeRoutes";
import dailyLessonRoutes from "./routes/dailyLessonRoutes";
dotenv.config();


const app = express();

connectDB();


app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/realtime", realtimeRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/avatar", avatarRoutes);
app.use("/api/users", userRoutes);
app.use("/api/heygen", heygenRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/mistakes", mistakeRoutes);
app.use("/api/daily-lesson", dailyLessonRoutes);

app.get("/", (req, res) => {
  res.send("Learni AI API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});