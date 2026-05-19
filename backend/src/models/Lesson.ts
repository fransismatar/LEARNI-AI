import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      required: true,
    },

    vocabulary: {
      type: [String],
      default: [],
    },

    grammarFocus: {
      type: String,
      default: "",
    },

    speakingPrompt: {
      type: String,
      required: true,
    },

    exampleConversation: {
      type: [
        {
          speaker: String,
          text: String,
        },
      ],
      default: [],
    },

    completed: {
      type: Boolean,
      default: false,
    },

    xpReward: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;