import mongoose from "mongoose";
import Claim from "../models/Claim.js";
import Document from "../models/Document.js";

// Simple Rule-Based AI for Risk Scoring
const analyzeRisk = (amount, incidentDate) => {
  let score = 0;
  let factors = [];

  // Rule 1: High Amount
  if (amount > 10000) {
    score += 40;
    factors.push("High Claim Amount (> $10k)");
  } else if (amount > 5000) {
    score += 20;
    factors.push("Moderate Claim Amount");
  }

  // Rule 2: Delayed Reporting (> 30 days)
  const daysDiff = (new Date() - new Date(incidentDate)) / (1000 * 60 * 60 * 24);
  if (daysDiff > 30) {
    score += 30;
    factors.push("Late Reporting (> 30 days)");
  }

  // Rule 3: Immediate Claim (suspicious if same day policy - simulated here)
  // In real app, check policy.startDate vs incidentDate

  // Cap score
  if (score > 100) score = 100;

  return { score, factors };
};

export const createClaim = async (req, res) => {
  try {
    const { amount, incidentDate, description, policyId } = req.body;

    // Validation
    if (!amount || !incidentDate || !description || !policyId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Please provide: amount, incidentDate, description, and policyId"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(policyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Policy ID format"
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // AI Analysis
    const { score, factors } = analyzeRisk(Number(amount), incidentDate);

    // Handle file uploads - create Document records
    const documentIds = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const document = await Document.create({
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size,
          uploadedBy: req.user.id,
          relatedTo: "claim",
          relatedId: policyId // Temporarily use policy ID, will update after claim creation
        });
        documentIds.push(document._id);
      }
    }

    const claim = await Claim.create({
      policy: policyId,
      customer: req.user.id,
      amount,
      incidentDate,
      description,
      riskScore: score,
      riskFactors: factors,
      documents: documentIds
    });

    // Update document relatedId to claim ID
    if (documentIds.length > 0) {
      await Document.updateMany(
        { _id: { $in: documentIds } },
        { relatedId: claim._id }
      );
    }

    res.json({ success: true, data: claim, aiAnalysis: { score, factors } });
  } catch (err) {
    console.error("Create claim error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to create claim"
    });
  }
};

export const getClaims = async (req, res) => {
  try {
    let query = {};

    // Role-based filtering
    if (req.user.role === "CUSTOMER") {
      query.customer = req.user.id;
    } else if (req.user.role === "AGENT") {
      query.agent = req.user.id;
    }
    // ADMIN sees all claims

    const claims = await Claim.find(query)
      .populate("policy")
      .populate("customer", "name email")
      .populate("documents");
    res.json({ success: true, data: claims });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate("policy")
      .populate("customer", "name email")
      .populate("documents");
    res.json({ success: true, data: claims });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const reviewClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // APPROVED, REJECTED, or PAID

    const claim = await Claim.findByIdAndUpdate(
      id,
      { status, actedBy: req.user.id },
      { new: true }
    ).populate("policy customer documents");

    if (!claim) {
      return res.status(404).json({ success: false, message: "Claim not found" });
    }

    res.json({ success: true, data: claim, message: `Claim ${status.toLowerCase()}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
