import express from "express";

import { updateUserSetup } from "../controllers/UserController.js";
import { getIncome } from "../controllers/UserController.js";

import { protect } from "../middleware/authMidware.js";

const router = express.Router();

router.put("/setup", protect, updateUserSetup);
router.get("/income", protect, getIncome);

export default router;
