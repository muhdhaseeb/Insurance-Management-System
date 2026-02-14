import express from "express";
import { createClaim, getClaims, getAllClaims, reviewClaim } from "../controllers/claimController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { validateClaimCreation, validateClaimReview, validateObjectId } from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.get("/", protect, getClaims);
router.get("/admin/all", protect, restrictTo("ADMIN", "AGENT"), getAllClaims);
router.post("/", protect, upload.array("documents", 5), validateClaimCreation, createClaim);
router.put("/:id/review", protect, validateObjectId, validateClaimReview, restrictTo("ADMIN"), reviewClaim);

export default router;
