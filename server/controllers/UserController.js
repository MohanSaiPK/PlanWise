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

export const getFinancialSnapshot = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "monthlyIncome savingsAmount needsAmount wantsAmount"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      snapshot: {
        monthlyIncome: user.monthlyIncome,
        savingsAmount: user.savingsAmount,
        needsAmount: user.needsAmount,
        wantsAmount: user.wantsAmount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getIncome = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "monthlyIncome jobIncome investmentIncome sideIncome"
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      income: {
        monthlyIncome: user.monthlyIncome,
        jobIncome: user.jobIncome,
        investmentIncome: user.investmentIncome,
        sideIncome: user.sideIncome,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
