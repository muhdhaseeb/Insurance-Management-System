import express from "express";
import { getPolicies, applyPolicy, getMyPolicies, updatePolicyStatus, deletePolicy, getAvailablePlans, getPolicyById } from "../controllers/policyController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { validatePolicyCreation, validatePolicyUpdate, validateObjectId } from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.get("/plans", protect, getAvailablePlans);
router.get("/", protect, getPolicies);
router.get("/my", protect, getMyPolicies);
router.post("/apply", protect, validatePolicyCreation, applyPolicy);
router.patch("/:id/status", protect, validateObjectId, validatePolicyUpdate, restrictTo("ADMIN", "AGENT"), updatePolicyStatus);
router.delete("/:id", protect, validateObjectId, restrictTo("ADMIN"), deletePolicy);
router.get("/:id", protect, validateObjectId, getPolicyById);

export default router;
