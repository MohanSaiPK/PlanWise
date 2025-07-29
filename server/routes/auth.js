import express from "express";
import cors from "cors";
import { register } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);

export default router;
