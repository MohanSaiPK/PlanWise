import express from "express";
import { protect } from "../middleware/authMidware.js";
import {
  getGoals,
  addGoals,
  editGoal,
  deleteGoal,
  allocateToGoal,
  getGoalWallet,
  addToGoalWallet,
  achieveGoal,
  getAchievedGoals,
} from "../controllers/GoalController.js";

const router = express.Router();

router.get("/", protect, getGoals);
router.get("/achieved", protect, getAchievedGoals);
router.post("/", protect, addGoals);
router.put("/:editingGoalId", protect, editGoal);
router.delete("/:goalId", protect, deleteGoal);
router.post("/:goalId/allocate", protect, allocateToGoal);
router.post("/wallet", protect, addToGoalWallet); //This is for adding money to the goal wallet(Transaction)
router.get("/wallet", protect, getGoalWallet); //This is for fetching the goal wallet balance
router.post("/:goalId/achieve", protect, achieveGoal);

export default router;
