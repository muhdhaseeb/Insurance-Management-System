import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    relatedTo: { type: String, enum: ["claim", "policy", "profile"], required: true },
    relatedId: { type: mongoose.Schema.Types.ObjectId, required: true },
    uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Document", documentSchema);
