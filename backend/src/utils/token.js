import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });

export const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
