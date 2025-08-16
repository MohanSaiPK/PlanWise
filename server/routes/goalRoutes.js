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

const router = express.Router();

router.get("/", protect, getGoals);
router.post("/", protect, addGoals);
router.put("/:editingGoalId", protect, editGoal);
router.delete("/:goalId", protect, deleteGoal);

router.post("/allocate", protect, allocateToGoal);
router.post("/distribute", protect, distributeRemaining);

export default router;
