import Policy from "../models/Policy.js";
import { INSURANCE_PLANS } from "../data/plans.js";

// Generate unique policy number
const generatePolicyNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `POL-${year}-${random}`;
};

export const getAvailablePlans = async (req, res) => {
  try {
    res.json({ success: true, data: INSURANCE_PLANS });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch plans" });
  }
};

export const getPolicies = async (req, res) => {
  try {
    let query = {};

    // Role-based filtering
    if (req.user.role === "CUSTOMER") {
      query.customer = req.user.id;
    } else if (req.user.role === "AGENT") {
      query.agent = req.user.id;
    }
    // ADMIN sees all policies

    const policies = await Policy.find(query).populate("customer agent", "name email");
    res.json({ success: true, data: policies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const applyPolicy = async (req, res) => {
  const { name, type, coverage, premium, durationYears, customer, agent } = req.body;
  try {
    const policyNumber = generatePolicyNumber();

    const policyData = {
      policyNumber,
      name,
      type,
      coverage,
      premium,
      durationYears,
      customer: customer || req.user.id, // Allow agents to create for customers
      status: "PENDING",
      paymentStatus: "UNPAID"
    };

    // If created by agent, assign agent
    if (req.user.role === "AGENT") {
      policyData.agent = req.user.id;
    } else if (agent) {
      policyData.agent = agent;
    }

    const policy = await Policy.create(policyData);
    res.status(201).json({ success: true, data: policy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyPolicies = async (req, res) => {
  try {
    const policies = await Policy.find({ customer: req.user.id });
    res.json({ success: true, data: policies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePolicyStatus = async (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;
  try {
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const policy = await Policy.findByIdAndUpdate(id, updateData, { new: true });

    if (!policy) {
      return res.status(404).json({ success: false, message: "Policy not found" });
    }

    res.json({ success: true, data: policy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndDelete(req.params.id);
    if (!policy) {
      return res.status(404).json({ success: false, message: "Policy not found" });
    }
    res.json({ success: true, message: "Policy deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPolicyById = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id).populate("customer agent", "name email");

    if (!policy) {
      return res.status(404).json({ success: false, message: "Policy not found" });
    }

    // Authorization Check
    const isOwner = policy.customer._id.toString() === req.user.id;
    const isAssignedAgent = policy.agent?._id.toString() === req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    if (!isOwner && !isAssignedAgent && !isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, data: policy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
