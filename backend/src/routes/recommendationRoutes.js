import express from "express";
import { getRecommendations, getAllPolicies } from "../controllers/recommendationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/all", protect, getAllPolicies);
router.post("/suggest", protect, getRecommendations);

export default router;
