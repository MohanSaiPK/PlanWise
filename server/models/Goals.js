import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    amount: { type: Number, required: true }, // Target amount
    contributed: { type: Number, default: 0 }, // How much saved toward goal
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    description: { type: String },
    priority: { type: String, enum: ["Low", "Medium", "High"] },
    status: {
      type: String,
      enum: ["In Progress", "Completed"],
      default: "In Progress",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Goal", GoalSchema);
