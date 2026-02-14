import mongoose from "mongoose";

const policySchema = new mongoose.Schema({
  policyNumber: { type: String, unique: true, required: true },
  name: String,
  type: { type: String, enum: ["HEALTH", "LIFE", "TRAVEL", "AUTO"], required: true },
  coverage: { type: Number, required: true }, // Renamed from coverageAmount
  premium: { type: Number, required: true },
  durationYears: Number,
  status: { type: String, enum: ["PENDING", "ACTIVE", "CANCELLED"], default: "PENDING" },
  paymentStatus: { type: String, enum: ["PAID", "UNPAID", "OVERDUE"], default: "UNPAID" },
  lastPaymentDate: Date,
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Policy", policySchema);
