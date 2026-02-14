import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    sender: { type: String, enum: ["user", "bot"] },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
