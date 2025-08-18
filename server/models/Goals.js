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
    allocated: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Achieved"], default: "Active" },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const GoalWalletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
});

const Goal = mongoose.model("Goal", GoalSchema);
const GoalWallet = mongoose.model("GoalWallet", GoalWalletSchema);

export { Goal, GoalWallet };
