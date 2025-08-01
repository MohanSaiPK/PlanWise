import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    //Validate request body
    const { email, password, confirmPassword, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Email and password are required",
      });
    } else if (!email.includes("@")) {
      return res.status(400).json({
        error: "Invalid email",
        message: "Please enter a valid email address",
      });
    } else if (!name) {
      return res.status(400).json({
        error: "Missing name",
        message: "Name is required",
      });
    } else if (password.length < 6) {
      return res.status(400).json({
        error: "Invalid password",
        message:
          "Password must be at least 6 characters long and email must be valid",
      });
    } else if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    } else {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      //Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      //Create new user
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      console.log("User registered successfully:", newUser);
      return res.status(201).json({
        message: "Regsitration successful",
      });
    }
  } catch (error) {
    console.error("Error in register:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    const isSetupComplete =
      user.monthlyIncome !== null &&
      user.monthlyIncome !== undefined &&
      user.jobIncome !== null &&
      user.jobIncome !== undefined &&
      user.needsRatio !== null &&
      user.needsRatio !== undefined &&
      user.wantsRatio !== null &&
      user.wantsRatio !== undefined &&
      user.savingsRatio !== null &&
      user.savingsRatio !== undefined;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
      isSetupComplete,
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
