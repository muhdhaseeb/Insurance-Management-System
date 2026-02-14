import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  policy: { type: mongoose.Schema.Types.ObjectId, ref: "Policy", required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  incidentDate: { type: Date, required: true },
  description: { type: String, required: true },
  riskScore: { type: Number, default: 0 },
  riskFactors: [String],
  status: {
    type: String,
    enum: ["SUBMITTED", "REVIEWED", "APPROVED", "REJECTED", "PAID"],
    default: "SUBMITTED"
  },
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
  actedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Claim", claimSchema);
