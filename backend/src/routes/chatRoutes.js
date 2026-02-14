import express from "express";
import { chat, getHistory } from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, chat);
router.get("/history", protect, getHistory);

export default router;
