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
