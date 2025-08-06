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
    } = req.body;

    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        jobIncome,
        investmentIncome,
        sideIncome,
        needsRatio,
        wantsRatio,
        savingsRatio,
        payday,
        currency,
        avatar,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Setup Completed",
      user: updateUser,
      isSetupComplete: updateUser.isSetupComplete,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
