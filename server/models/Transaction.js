import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: String,
  description: String,
  amount: Number,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Transaction", TransactionSchema);
