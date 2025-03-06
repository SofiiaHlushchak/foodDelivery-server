import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";
import User from "../models/User.js";
import { getCoordinates, getRoute } from "../services/googleMapsService.js";

export const initializeWebSocket = (wss) => {
    wss.on("connection", (ws) => {
        console.log("WebSocket client connected");

        ws.on("message", async (message) => {
            const { orderId } = JSON.parse(message);
            const order = await Order.findById(orderId).populate(
                "foodItems.foodId"
            );
            if (!order) {
                return ws.send(JSON.stringify({ error: "Order not found" }));
            }

            const firstFoodItem = order.foodItems[0]?.foodId;
            const restaurant = await Restaurant.findOne({
                id: firstFoodItem.restaurantId,
            });
            const user = await User.findById(order.userId);

            if (!restaurant || !user) {
                return ws.send(
                    JSON.stringify({ error: "Restaurant or user not found" })
                );
            }

            const restaurantCoords = await getCoordinates(restaurant.address);
            const userCoords = await getCoordinates(
                `${user.deliveryAddress.street}, ${user.deliveryAddress.city}, ${user.deliveryAddress.region}`
            );
            if (!restaurantCoords || !userCoords) {
                return ws.send(
                    JSON.stringify({ error: "Unable to fetch coordinates" })
                );
            }

            const route = await getRoute(restaurantCoords, userCoords);
            if (!route || route.length === 0) {
                return ws.send(JSON.stringify({ error: "Route not found" }));
            }

            let index = 0;
            order.status = "shipped";

            await order.save();
            ws.send(JSON.stringify({ status: "shipped" }));

            const interval = setInterval(async () => {
                if (index < route.length) {
                    ws.send(JSON.stringify({ location: route[index] }));
                    index++;
                } else {
                    clearInterval(interval);
                    order.status = "delivered";
                    await order.save();
                    ws.send(JSON.stringify({ status: "delivered" }));

                    ws.close();
                }
            }, 5000);
        });

        ws.on("close", () => {
            console.log("WebSocket client disconnected");
        });
    });
};
