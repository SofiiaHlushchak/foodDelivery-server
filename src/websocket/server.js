import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";
import User from "../models/User.js";
import { getCoordinates, getRoute } from "../services/googleMapsService.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

            order.status = "confirmed";

            await order.save();
            await delay(1000);

            ws.send(
                JSON.stringify({
                    status: order.status,
                    statusUpdatedAt: new Date().toISOString(),
                })
            );

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

            const { steps, distance } = await getRoute(
                restaurantCoords,
                userCoords
            );

            if (!steps || steps.length === 0) {
                return ws.send(JSON.stringify({ error: "Route not found" }));
            }

            ws.send(JSON.stringify({ restaurantCoords, userCoords, distance }));

            let index = 0;
            order.status = "shipped";

            await order.save();
            await delay(1000);

            ws.send(
                JSON.stringify({
                    status: order.status,
                    statusUpdatedAt: new Date().toISOString(),
                })
            );

            const interval = setInterval(async () => {
                if (index < steps.length) {
                    const currentLocation = steps[index];

                    const { distance } = await getRoute(
                        currentLocation,
                        userCoords
                    );

                    ws.send(
                        JSON.stringify({
                            location: currentLocation,
                            distance: distance,
                        })
                    );
                    index++;
                } else {
                    clearInterval(interval);
                    order.status = "delivered";
                    await order.save();
                    ws.send(
                        JSON.stringify({
                            status: order.status,
                            statusUpdatedAt: new Date().toISOString(),
                        })
                    );

                    ws.close();
                }
            }, 5000);
        });

        ws.on("close", () => {
            console.log("WebSocket client disconnected");
        });
    });
};
