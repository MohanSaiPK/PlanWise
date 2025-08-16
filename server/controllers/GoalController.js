import Goals from "../models/Goals.js";

export const getGoals = async (req, res) => {
  try {
    const goals = await Goals.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching goals", err });
  }
};

export const addGoals = async (req, res) => {
  try {
    const newGoal = new Goals({
      ...req.body,
      userId: req.user.id,
    });
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(500).json({ message: "Error adding goal", err });
  }
};

export const editGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const updates = req.body;

    const goal = await Goals.findOneAndUpdate(
      { _id: goalId, userId: req.user.id },
      updates,
      { new: true }
    );

    if (!goal) return res.status(404).json({ message: "Goal not found" });

    res.status(200).json(goal);
  } catch (err) {
    res.status(500).json({ message: "Error updating goal", err });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const { goalId } = req.params;

    const goal = await Goals.findOneAndDelete({
      _id: goalId,
      userId: req.user.id,
    });

    if (!goal) return res.status(404).json({ message: "Goal not found" });

    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting goal", err });
  }
};

export const allocateToGoal = async (req, res) => {
  try {
    const { goalId, amount } = req.body;

    const goal = await Goals.findOne({ _id: goalId, userId: req.user.id });
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    // Update contributed amount
    goal.contributed += amount;

    // If goal is complete, mark status
    if (goal.contributed >= goal.amount) {
      goal.status = "Completed";
    }

    await goal.save();
    res.status(200).json({ message: "Funds allocated successfully", goal });
  } catch (err) {
    res.status(500).json({ message: "Error allocating funds", err });
  }
};

export const distributeRemaining = async (req, res) => {
  try {
    const { remainingAmount, distribution } = req.body;
    // distribution example: [{ goalId: "...", percent: 50 }, { goalId: "...", percent: 50 }]

    let results = [];
    for (const dist of distribution) {
      const goal = await Goals.findOne({
        _id: dist.goalId,
        userId: req.user.id,
      });
      if (!goal) continue;

      const contribution = (remainingAmount * dist.percent) / 100;
      goal.contributed += contribution;

      if (goal.contributed >= goal.amount) {
        goal.status = "Completed";
      }

      await goal.save();
      results.push(goal);
    }

    res.status(200).json({ message: "Remaining money distributed", results });
  } catch (err) {
    res.status(500).json({ message: "Error distributing money", err });
  }
};
