import express from "express";
import { protect } from "../middleware/authMidware.js";
import {
  getGoals,
  addGoals,
  //   updateGoal,
  //   deleteGoal,
} from "../controllers/GoalController.js";

const router = express.Router();

router.get("/", protect, getGoals);
router.post("/", protect, addGoals);
// router.put("/:id", protect, updateGoal);
// router.delete("/:id", protect, deleteGoal);

export default router;
