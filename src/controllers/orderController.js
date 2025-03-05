import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
    try {
        const { totalPrice, paymentMethod, cardNumber, foodItems } = req.body;
        const userId = req.userId;

        if (!userId || !totalPrice || !paymentMethod || !foodItems?.length) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (paymentMethod === "card" && !cardNumber) {
            return res
                .status(400)
                .json({ message: "Card number is required for card payments" });
        }

        const lastOrder = await Order.findOne().sort({ number: -1 });

        const orderNumber = lastOrder?.number ? lastOrder?.number + 1 : 1;

        const orderData = {
            userId,
            totalPrice,
            paymentMethod,
            foodItems: foodItems,
            status: "pending",
            number: orderNumber,
        };

        if (paymentMethod === "card") {
            orderData.cardNumber = cardNumber;
        }

        const order = new Order(orderData);
        await order.save();

        res.status(201).json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req;

        if (!userId) {
            return res.status(400).json({ message: "User ID not found" });
        }

        const orders = await Order.find({ userId })
            .populate("foodItems.foodId", "name price imgUrl ingredients")
            .lean();

        if (!orders.length) {
            return res
                .status(404)
                .json({ message: "No orders found for this user" });
        }

        const modifiedOrders = orders.map((order) => ({
            ...order,
            foodItems: order.foodItems.map((foodItem) => ({
                dish: foodItem.foodId,
                quantity: foodItem.quantity,
                addons: foodItem.addons,
            })),
        }));

        res.status(200).json(modifiedOrders);
    } catch (error) {
        console.error("Error getting orders:", error);
        res.status(500).json({ message: "Server error" });
    }
};
