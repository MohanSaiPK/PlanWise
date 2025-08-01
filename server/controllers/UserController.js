import User from "../models/User.js";

export const updateUserSetup = async (req, res) => {
  try {
    const {
      jobIncome = 0,
      investmentIncome = 0,
      sideIncome = 0,
      needsRatio,
      wantsRatio,
      savingsRatio,
      payday,
      currency,
      avatar,
      savingsGoal,
      financialGoals,
    } = req.body;

    const monthlyIncome =
      Number(jobIncome) + Number(investmentIncome) + Number(sideIncome);

    const isSetupComplete =
      monthlyIncome !== null &&
      monthlyIncome !== undefined &&
      jobIncome !== null &&
      jobIncome !== undefined &&
      needsRatio !== null &&
      needsRatio !== undefined &&
      wantsRatio !== null &&
      wantsRatio !== undefined &&
      savingsRatio !== null &&
      savingsRatio !== undefined;

    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        jobIncome,
        investmentIncome,
        sideIncome,
        monthlyIncome,
        needsRatio,
        wantsRatio,
        savingsRatio,
        payday,
        currency,
        avatar,
        savingsGoal,
        financialGoals,
        isSetupComplete,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Setup Completed",
      user: updateUser,
      isSetupComplete: true,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
