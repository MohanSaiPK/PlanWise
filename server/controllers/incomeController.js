import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

// GET /api/income/monthly?month=6&year=2025 (month: 0=Jan, 11=Dec)
export const getCurrentMonthIncomeExpenses = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const month =
      req.query.month !== undefined ? Number(req.query.month) : now.getMonth();
    const year =
      req.query.year !== undefined ? Number(req.query.year) : now.getFullYear();

    // Get user's current base income
    const user = await User.findById(userId);
    const baseIncome = user ? user.baseIncome : 0;

    // Get all income transactions for the month
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 1);

    const incomeTransactions = await Transaction.find({
      userId,
      type: "income",
      date: { $gte: start, $lt: end },
    });

    const additionalIncome = incomeTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const expenseTransactions = await Transaction.find({
      userId,
      type: "expense",
      date: { $gte: start, $lt: end },
    });

    const totalExpenses = expenseTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    res.status(200).json({
      baseIncome,
      additionalIncome,
      totalIncome: baseIncome + additionalIncome,
      totalExpenses,

      details: incomeTransactions,
      month,
      year,
      success: true,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error calculating monthly income: " + err.message });
  }
};
