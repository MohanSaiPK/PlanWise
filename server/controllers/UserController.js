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

export const getBaseIncome = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "baseIncome jobIncome investmentIncome sideIncome"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      income: {
        baseIncome: user.baseIncome,
        jobIncome: user.jobIncome,
        investmentIncome: user.investmentIncome,
        sideIncome: user.sideIncome,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "name email avatar payday"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
