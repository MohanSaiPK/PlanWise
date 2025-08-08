import express from "express";
import { protect } from "../middleware/authMidware.js";
import { getCurrentMonthIncomeExpenses } from "../controllers/IncomeController.js";

const router = express.Router();

router.get("/", protect, getCurrentMonthIncomeExpenses);

export default router;
