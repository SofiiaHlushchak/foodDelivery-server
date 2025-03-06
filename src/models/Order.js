import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["card", "paypal", "apple-pay"],
            required: true,
        },
        cardNumber: {
            type: String,
            required: function () {
                return this.paymentMethod === "card";
            },
        },
        foodItems: [
            {
                foodId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "FoodItem",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                addons: [
                    {
                        name: { type: String, required: true },
                        price: { type: Number, required: true },
                        countable: { type: Boolean, required: true },
                    },
                ],
            },
        ],
        status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        number: {
            type: Number,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
