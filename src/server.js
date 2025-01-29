import express from "express";
import connectDB from "./db.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";

const app = express();
const port = 3000;

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.use("/restaurants", restaurantRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
