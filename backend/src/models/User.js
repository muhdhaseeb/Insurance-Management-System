import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["ADMIN", "AGENT", "CUSTOMER"], default: "CUSTOMER" },
  phone: String,
  age: Number,
  occupation: String,
  address: String,
  isVerified: { type: Boolean, default: false },
  profilePic: String,
  refreshToken: String,
  otp: String,
  otpExpires: Date,
  resetToken: String,
  resetTokenExpires: Date
}, { timestamps: true });

export default mongoose.model("User", userSchema);
