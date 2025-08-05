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
