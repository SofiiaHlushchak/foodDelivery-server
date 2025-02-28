import PaymentCard from "../models/PaymentCard.js";
import jwt from "jsonwebtoken";

export const savePaymentCard = async (req, res) => {
    const { cardNumber, expirationDate } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token not provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    if (!cardNumber || !expirationDate) {
        return res
            .status(400)
            .json({ message: "Card number and expiration date are required" });
    }

    try {
        const newPaymentCard = new PaymentCard({
            userId,
            cardNumber,
            expirationDate,
        });

        await newPaymentCard.save();
        res.status(201).json(newPaymentCard);
    } catch (error) {
        res.status(500).json({ message: "Error saving payment card", error });
    }
};

export const getUserPaymentCards = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token not provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const paymentCards = await PaymentCard.find({ userId });

        if (paymentCards.length === 0) {
            return res
                .status(404)
                .json({ message: "No payment cards found for this user" });
        }

        res.status(200).json(paymentCards);
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving payment cards",
            error,
        });
    }
};
