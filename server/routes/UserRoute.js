import express from "express";

import {
  updateUserSetup,
  getBaseIncome,
  getUserProfile,
} from "../controllers/UserController.js";

import { protect } from "../middleware/authMidware.js";

const router = express.Router();

router.put("/setup", protect, updateUserSetup);
router.get("/user-base-income", protect, getBaseIncome);
router.get("/profile", protect, getUserProfile);

export default router;
