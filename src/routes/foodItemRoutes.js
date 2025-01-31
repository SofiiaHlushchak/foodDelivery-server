import express from "express";
import {
    getFoodItemById,
    getFoodItems,
} from "../controllers/foodItemController.js";

const router = express.Router();

router.get("/", getFoodItems);
router.get("/:foodItemId", getFoodItemById);

export default router;
