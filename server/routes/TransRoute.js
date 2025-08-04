import express from "express";
import { protect } from "../middleware/authMidware.js";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
} from "../controllers/TransController.js";

const router = express.Router();

router.get("/", protect, getTransactions);
router.post("/", protect, addTransaction);
router.delete("/:id", protect, deleteTransaction);

export default router;
