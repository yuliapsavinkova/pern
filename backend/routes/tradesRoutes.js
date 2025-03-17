import express from "express";
import { getTrades, getTrade, createTrade, updateTrade, deleteTrade } from "../controllers/tradesController.js";

const router = express.Router();

router.get("/", getTrades);
router.post("/", createTrade);
router.get("/:id", getTrade);
router.put("/:id", updateTrade);
router.delete("/:id", deleteTrade);

export default router;
