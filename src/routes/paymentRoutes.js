import express from "express";
import {
    getUserPaymentCards,
    savePaymentCard,
    createPaymentLink,
} from "../controllers/paymentController.js";

const router = express.Router();

router.get("/", getUserPaymentCards);
router.post("/save", savePaymentCard);
router.post("/create-payment-link", createPaymentLink);
export default router;
