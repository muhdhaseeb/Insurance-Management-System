import express from "express";
import { register, login, verifyOtp, me, logout, getUsers, updateProfile, forgotPassword, resetPassword } from "../controllers/authController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { validateUserRegistration, validateUserUpdate } from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.post("/register", validateUserRegistration, register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logout);
router.get("/me", protect, me);
router.put("/profile", protect, validateUserUpdate, updateProfile);
router.get("/users", protect, restrictTo("ADMIN"), getUsers);

export default router;
