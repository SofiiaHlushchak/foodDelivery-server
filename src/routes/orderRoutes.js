import express from "express";
import {
    createOrder,
    getUserOrders,
    getOrderById,
} from "../controllers/orderController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = express.Router();

router.get("/:orderId", authenticateUser, getOrderById);
router.get("/", authenticateUser, getUserOrders);
router.post("/", authenticateUser, createOrder);

export default router;
