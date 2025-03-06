import express from "express";
import {
    getUserPaymentCards,
    savePaymentCard,
    createPaymentLink,
} from "../controllers/paymentController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = express.Router();

router.get("/", authenticateUser, getUserPaymentCards);
router.post("/save", authenticateUser, savePaymentCard);
router.post("/create-payment-link", authenticateUser, createPaymentLink);

export default router;
