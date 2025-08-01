import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  jobIncome: { type: Number, default: null },
  investmentIncome: { type: Number, default: null },
  sideIncome: { type: Number, default: null },
  needsRatio: { type: Number, default: null },
  wantsRatio: { type: Number, default: null },
  savingsRatio: { type: Number, default: null },
  payday: { type: String },
  currency: { type: String, default: "INR" },
  avatar: { type: String },
  savingsGoal: { type: Number, default: null },
  financialGoals: [{ type: String }],
});

export default mongoose.model("User", UserSchema);
