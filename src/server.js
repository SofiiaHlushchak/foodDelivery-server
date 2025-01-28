const express = require("express");
const connectDB = require("./db");

const app = express();
const port = 3000;

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
