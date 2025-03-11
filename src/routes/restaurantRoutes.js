import express from "express";
import {
    getRestaurants,
    getRestaurantById,
    updateRestaurantRating
} from "../controllers/restaurantController.js";

const router = express.Router();

router.get("/", getRestaurants);
router.get("/:restaurantId", getRestaurantById);
router.put("/:restaurantId/update-rating", updateRestaurantRating);

export default router;
