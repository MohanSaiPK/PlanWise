import express from "express";

import { updateUserSetup } from "../controllers/UserController.js";

import { protect } from "../middleware/authMidware.js";

const router = express.Router();

router.put("/setup", protect, updateUserSetup);

export default router;
