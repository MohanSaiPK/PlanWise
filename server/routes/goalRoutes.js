import express from "express";
import { protect } from "../middleware/authMidware.js";
import {
  getGoals,
  addGoals,
  editGoal,
  deleteGoal,
  allocateToGoal,
  distributeRemaining,
} from "../controllers/GoalController.js";
import { addToGoalWallet } from "../controllers/TransController.js";

const router = express.Router();

router.get("/", protect, getGoals);
router.post("/", protect, addGoals);
router.put("/:editingGoalId", protect, editGoal);
router.delete("/:goalId", protect, deleteGoal);

router.post("/allocate", protect, allocateToGoal);
router.post("/distribute", protect, distributeRemaining);
console.log("Goal routes loaded successfully");
router.post("/wallet", protect, addToGoalWallet);

export default router;
