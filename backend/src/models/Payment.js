import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    policy: { type: mongoose.Schema.Types.ObjectId, ref: "Policy", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["PENDING", "SUCCEEDED", "FAILED"],
        default: "PENDING"
    },
    stripePaymentIntentId: String,
    stripeChargeId: String,
    metadata: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
