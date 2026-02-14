import express from "express";
import { createPaymentIntent, confirmPayment, getPayments, getPolicyPayments } from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validatePaymentCreation, validateObjectId, validatePolicyIdParam } from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.post("/create-intent", protect, validatePaymentCreation, createPaymentIntent);
router.post("/confirm", protect, confirmPayment);
router.get("/", protect, getPayments);
router.get("/policy/:policyId", protect, validatePolicyIdParam, getPolicyPayments);

export default router;
