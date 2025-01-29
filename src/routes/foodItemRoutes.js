import express from "express";
import { getFoodItems } from "../controllers/foodItemController.js";

const router = express.Router();

router.get("/", getFoodItems);

export default router;
