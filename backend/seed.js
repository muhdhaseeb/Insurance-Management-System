import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./src/models/User.js";
import Policy from "./src/models/Policy.js";

await mongoose.connect("mongodb://127.0.0.1:27017/insurance_system");

const existingAdmin = await User.findOne({ email: "admin@insurance.com" });
if (!existingAdmin) {
  const admin = await User.create({
    name: "Admin User",
    email: "admin@insurance.com",
    password: await bcrypt.hash("Admin123", 10),
    role: "ADMIN"
  });
  console.log("Admin created");
}

await Policy.deleteMany({ customer: { $exists: false } }); // Clear template policies if any

await Policy.insertMany([
  { name: "Health Pro Max", type: "HEALTH", coverageAmount: 50000, premium: 80, durationYears: 1, status: "ACTIVE" },
  { name: "Family Life Secure", type: "LIFE", coverageAmount: 500000, premium: 120, durationYears: 10, status: "ACTIVE" },
  { name: "Travel Protection Plus", type: "TRAVEL", coverageAmount: 25000, premium: 45, durationYears: 1, status: "ACTIVE" }
]);

console.log("Seeded with template policies");
process.exit();
