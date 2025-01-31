import express from "express";
import {
    getRestaurants,
    getRestaurantById,
} from "../controllers/restaurantController.js";

const router = express.Router();

router.get("/", getRestaurants);
router.get("/:restaurantId", getRestaurantById);

export default router;
