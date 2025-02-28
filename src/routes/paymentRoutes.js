import express from "express";
import {
    getUserPaymentCards,
    savePaymentCard,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/save", savePaymentCard);
router.get("/", getUserPaymentCards);

export default router;
