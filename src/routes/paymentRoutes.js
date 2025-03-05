import express from "express";
import {
    getUserPaymentCards,
    savePaymentCard,
} from "../controllers/paymentController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = express.Router();

router.post("/save", authenticateUser, savePaymentCard);
router.get("/", authenticateUser, getUserPaymentCards);

export default router;
