import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import foodItemRoutes from './routes/foodItemRoutes.js'

const app = express();
const port = 3000;

app.use(express.json());

connectDB();

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.use("/restaurants", restaurantRoutes);
app.use("/dishes", foodItemRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
