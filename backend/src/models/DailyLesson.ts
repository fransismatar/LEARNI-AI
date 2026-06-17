import mongoose from "mongoose";

const dailyLessonSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },

    topic: { type: String, required: true },
    level: { type: String, default: "Beginner" },

    speakingTask: { type: String, required: true },
    words: { type: [String], default: [] },
    storyTask: { type: String, required: true },

    quiz: {
      question: { type: String, default: "" },
      options: { type: [String], default: [] },
      answer: { type: String, default: "" },
    },

    completed: {
      speaking: { type: Boolean, default: false },
      words: { type: Boolean, default: false },
      story: { type: Boolean, default: false },
      quiz: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

dailyLessonSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("DailyLesson", dailyLessonSchema);