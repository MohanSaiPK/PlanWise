import User from "../models/User.js";

export const updateUserSetup = async (req, res) => {
  try {
    const updates = req.body;

    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        monthlyIncome:
          Number(req.body.jobIncome || 0) +
          Number(req.body.investmentIncome || 0) +
          Number(req.body.sideIncome || 0),
        needsRatio: req.body.needsRatio,
        wantsRatio: req.body.wantsRatio,
        savingsRatio: req.body.savingsRatio,
        payday: req.body.payday,
        currency: req.body.currency,
        avatar: req.body.avatar,
        savingsGoal: req.body.savingsGoal,
        financialGoals: req.body.financialGoals,
      },
      {
        new: true,
      }
    );
    res
      .status(201)
      .json({ success: true, message: "Setup Completed", user: updateUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
