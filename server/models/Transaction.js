import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Food",
      "Transport",
      "Entertainment",
      "Bills",
      "Bonus",
      "Business",
      "Investments",
      "Other",
      "Goal",
    ],
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    required: true,
    enum: ["expense", "income"],
  },
});

export default mongoose.model("Transaction", transactionSchema);
