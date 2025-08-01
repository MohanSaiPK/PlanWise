import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  monthlyIncome: { type: Number, default: null },
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

UserSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (
    update.jobIncome !== undefined ||
    update.investmentIncome !== undefined ||
    update.sideIncome !== undefined
  ) {
    const jobIncome = Number(update.jobIncome || 0);
    const investmentIncome = Number(update.investmentIncome || 0);
    const sideIncome = Number(update.sideIncome || 0);
    update.monthlyIncome = jobIncome + investmentIncome + sideIncome;
  }
  next();
});

export default mongoose.model("User", UserSchema);
