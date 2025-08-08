import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  // Incomes
  baseIncome: { type: Number, default: 0 },
  jobIncome: { type: Number, default: 0 },
  investmentIncome: { type: Number, default: 0 },
  sideIncome: { type: Number, default: 0 },

  // Ratios
  needsRatio: { type: Number, default: 4 },
  wantsRatio: { type: Number, default: 3 },
  savingsRatio: { type: Number, default: 3 },

  // Calculated allocations
  needsAmount: { type: Number, default: 0 },
  wantsAmount: { type: Number, default: 0 },
  savingsAmount: { type: Number, default: 0 },

  // Profile
  payday: { type: String },
  currency: { type: String, default: "INR" },
  avatar: { type: String },

  // Setup completion
  isSetupComplete: { type: Boolean, default: false },
});

// Auto-calc before update
UserSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() || {};

  const jobIncome = Number(update.jobIncome ?? this.get("jobIncome") ?? 0);
  const investmentIncome = Number(
    update.investmentIncome ?? this.get("investmentIncome") ?? 0
  );
  const sideIncome = Number(update.sideIncome ?? this.get("sideIncome") ?? 0);

  const baseIncome = jobIncome + investmentIncome + sideIncome;
  update.baseIncome = baseIncome;

  const needsRatio = Number(update.needsRatio ?? this.get("needsRatio") ?? 0);
  const wantsRatio = Number(update.wantsRatio ?? this.get("wantsRatio") ?? 0);
  const savingsRatio = Number(
    update.savingsRatio ?? this.get("savingsRatio") ?? 0
  );

  const totalRatio = needsRatio + wantsRatio + savingsRatio;

  if (totalRatio > 0 && baseIncome > 0) {
    update.needsAmount = (needsRatio / totalRatio) * baseIncome;
    update.wantsAmount = (wantsRatio / totalRatio) * baseIncome;
    update.savingsAmount = (savingsRatio / totalRatio) * baseIncome;
  }

  update.isSetupComplete =
    baseIncome > 0 && needsRatio >= 0 && wantsRatio >= 0 && savingsRatio >= 0;

  next();
});

export default mongoose.model("User", UserSchema);
