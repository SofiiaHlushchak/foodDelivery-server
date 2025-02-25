import express from "express";
import { updateUser } from "../controllers/userController.js";

const router = express.Router();

router.patch("/update", updateUser);

export default router;
