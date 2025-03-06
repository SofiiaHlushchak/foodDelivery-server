import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import connectDB from "./db.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import foodItemRoutes from "./routes/foodItemRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import novaPoshtaRoutes from "./routes/novaPoshtaRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { initializeWebSocket } from "./websocket/server.js";

const app = express();
const port = 3000;

const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());

connectDB();

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.use("/restaurants", restaurantRoutes);
app.use("/dishes", foodItemRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api/novaposhta", novaPoshtaRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/orders", orderRoutes);

initializeWebSocket(wss);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
