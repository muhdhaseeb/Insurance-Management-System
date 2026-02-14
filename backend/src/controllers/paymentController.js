import Stripe from "stripe";
import Policy from "../models/Policy.js";
import Payment from "../models/Payment.js";

// Initialize with a dummy key if env not set for build safety, 
// BUT logic requires real key. User should set STRIPE_SECRET_KEY in .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

export const createPaymentIntent = async (req, res) => {
    const { amount, policyId } = req.body;

    try {
        // Verify policy exists and belongs to user
        const policy = await Policy.findById(policyId);
        if (!policy) {
            return res.status(404).json({ success: false, message: "Policy not found" });
        }

        if (policy.customer.toString() !== req.user.id && req.user.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Cents
            currency: "usd",
            metadata: { policyId, customerId: req.user.id },
        });

        // Create Payment record
        const payment = await Payment.create({
            policy: policyId,
            customer: req.user.id,
            amount,
            status: "PENDING",
            stripePaymentIntentId: paymentIntent.id
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentId: payment._id
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const confirmPayment = async (req, res) => {
    const { paymentIntentId, status } = req.body;

    try {
        // Find payment by Stripe payment intent ID
        const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });

        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment record not found" });
        }

        if (status === "succeeded") {
            // Update payment record
            payment.status = "SUCCEEDED";
            await payment.save();

            // Update policy
            await Policy.findByIdAndUpdate(payment.policy, {
                paymentStatus: "PAID",
                lastPaymentDate: new Date(),
                status: "ACTIVE" // Activate policy upon payment
            });

            res.json({ success: true, message: "Payment confirmed and policy activated" });
        } else {
            payment.status = "FAILED";
            await payment.save();
            res.status(400).json({ success: false, message: "Payment failed" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getPayments = async (req, res) => {
    try {
        let query = {};

        // Role-based filtering
        if (req.user.role === "CUSTOMER") {
            query.customer = req.user.id;
        }
        // ADMIN and AGENT see all payments

        const payments = await Payment.find(query)
            .populate("policy", "policyNumber name type premium")
            .populate("customer", "name email")
            .sort({ createdAt: -1 });

        res.json({ success: true, data: payments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getPolicyPayments = async (req, res) => {
    try {
        const { policyId } = req.params;
        const payments = await Payment.find({ policy: policyId }).sort({ createdAt: -1 });
        res.json({ success: true, data: payments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
