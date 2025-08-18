import { GoalWallet, Goal } from "../models/Goals.js";

export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id, deleted: false }).sort(
      {
        createdAt: -1,
      }
    );
    res.status(200).json(goals);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching goals", error: err.message });
  }
};

export const addGoals = async (req, res) => {
  try {
    const newGoal = new Goal({
      ...req.body,
      userId: req.user.id,
    });

    if (newGoal.amount > 0) {
      await newGoal.save();
      res.status(201).json(newGoal);
    } else {
      res.status(400).json({ message: "Invalid goal amount" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error adding goal", error: err.message });
  }
};

export const editGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const updates = req.body;

    const goal = await Goal.findOneAndUpdate(
      { _id: goalId, userId: req.user.id },
      updates,
      { new: true }
    );

    if (!goal) return res.status(404).json({ message: "Goal not found" });

    res.status(200).json(goal);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating goal", error: err.message });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const { goalId } = req.params;

    const goal = await Goal.findOne({
      _id: goalId,
      userId: req.user.id,
    });

    if (!goal) return res.status(404).json({ message: "Goal not found" });
    const wallet = await GoalWallet.findOne({ userId: goal.userId });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    if (goal.status === "Achieved") {
      // For achieved goals → archive only, don't revert money
      goal.deleted = true;
      await goal.save();
      return res.status(200).json({ message: "Achieved goal archived", goal });
    }

    // For normal active goals → revert allocated money back to wallet
    if (goal.allocated > 0) {
      wallet.balance += goal.allocated;
      await wallet.save();
    }

    goal.deleted = true;
    await goal.save();

    const updatedGoals = await Goal.find({
      userId: req.user.id,
      deleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Goal deleted and funds reverted",
      wallet,
      goals: updatedGoals,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting goal", error: err.message });
  }
};

export const allocateToGoal = async (req, res) => {
  try {
    const { goalId, amount } = req.body;
    const userId = req.user.id;

    const wallet = await GoalWallet.findOne({ userId });
    const goal = await Goal.findOne({ _id: goalId, userId });

    if (!wallet) return res.status(404).json({ message: "Wallet not found" });
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be greater than zero" });
    }
    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }
    if (goal.allocated + amount > goal.amount) {
      return res
        .status(400)
        .json({ message: "Allocation exceeds goal target" });
    }
    // Deduct from wallet & add to goal allocation
    wallet.balance -= amount;
    goal.allocated += amount;

    await wallet.save();
    await goal.save();

    res.status(200).json({ message: "Allocated successfully", goal, wallet });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error allocating funds", error: err.message });
  }
};

export const achieveGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const userId = req.user.id;

    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    if (goal.deleted) {
      return res.status(400).json({ message: "Cannot achieve a deleted goal" });
    }
    if (goal.allocated === 0) {
      return res
        .status(400)
        .json({ message: "Cannot achieve a goal with no funds allocated" });
    }

    goal.status = "Achieved";
    goal.achievedAt = new Date();
    await goal.save();

    return res.status(200).json({
      message: "Goal achieved",
      goal,
      wallet: await GoalWallet.findOne({ userId }),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error marking goal achieved", error: err.message });
  }
};

// Fetch achieved goals (for reports/insights)
export const getAchievedGoals = async (req, res) => {
  try {
    const achievedGoals = await Goal.find({
      userId: req.user.id,
      status: "Achieved",
    }).sort({ updatedAt: -1 });

    res.status(200).json(achievedGoals);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching achieved goals", error: err.message });
  }
};
