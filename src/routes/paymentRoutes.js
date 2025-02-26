import express from "express";
import { savePaymentCard } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/save", savePaymentCard);

export default router;
