import express from "express";
import { updateUser } from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = express.Router();

router.patch("/update", authenticateUser, updateUser);

export default router;
