import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.status(200).json({ transactions, success: true });
  } catch (err) {
    res.status(500).json({ message: "Error fetching transactions" + err });
  }
};

//Adding Transactions
export const addTransaction = async (req, res) => {
  try {
    const newTransaction = new Transaction({
      ...req.body,
      userId: req.user.id,
    });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(500).json({ message: "Error adding transaction" + err });
  }
};

//Delete Trans
export const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting transaction" + err });
  }
};

export const addToGoalWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    const transaction = new Transaction({
      userId: req.user.id,
      amount,
      type: "expense",
      category: "Goal",
      description: "Added to Goals Wallet",
      date: new Date().toISOString(),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    });
    await transaction.save();
    res.status(201).json({ success: true, transaction });
  } catch (err) {
    console.error("Add to wallet error:", err);
    res
      .status(500)
      .json({ message: "Error adding to goals wallet", error: err.message });
  }
};
