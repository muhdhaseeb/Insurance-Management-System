import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import policyRoutes from "./routes/policyRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Static file serving for uploaded documents
app.use("/uploads", express.static("uploads"));

// health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API running",
  });
});

// routes
app.use("/auth", authRoutes);
app.use("/policies", policyRoutes);
app.use("/claims", claimRoutes);
app.use("/payments", paymentRoutes);
app.use("/recommendations", recommendationRoutes);
app.use("/chat", chatRoutes);
app.use("/documents", documentRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;

