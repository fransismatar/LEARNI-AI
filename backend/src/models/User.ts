import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    onboardingCompleted: {
      type: Boolean,
      default: false,
    },

  learningProfile: {
  type: mongoose.Schema.Types.Mixed,
  default: {},
},
aiLearningPlan: {
  type: mongoose.Schema.Types.Mixed,
  default: null,
},
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;