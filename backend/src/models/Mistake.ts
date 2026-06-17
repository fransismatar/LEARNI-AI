import mongoose from "mongoose";

const mistakeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalText: {
      type: String,
      required: true,
    },

    correction: {
      type: String,
      required: true,
    },

    explanation: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "general",
    },

    reviewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Mistake = mongoose.model("Mistake", mistakeSchema);

export default Mistake;