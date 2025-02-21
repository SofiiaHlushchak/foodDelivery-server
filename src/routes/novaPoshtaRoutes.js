import express from "express";
import { getWarehouses } from "../controllers/novaPoshtaController.js";

const router = express.Router();

router.get("/warehouses", getWarehouses);

export default router;
