import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../api";

export default function PaymentForm({ amount, policyId, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        if (!stripe || !elements) return;

        try {
            // 1. Create PaymentIntent
            const { data } = await api.post("/payments/create-intent", { amount, policyId }, { withCredentials: true });

            // 2. Confirm Card Payment
            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else {
                if (result.paymentIntent.status === "succeeded") {
                    // 3. Update Backend Status
                    await api.post("/payments/confirm", { policyId, status: "succeeded" }, { withCredentials: true });
                    onSuccess();
                }
            }
        } catch (err) {
            setError("Payment processing failed.");
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-slate-200 shadow-lg max-w-sm w-full mx-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Pay Premium</h3>

            <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-100 flex justify-between items-center">
                <span className="text-slate-500 font-medium text-sm">Amount Due</span>
                <span className="text-slate-900 font-bold text-lg">${amount}</span>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Card Details</label>
                <div className="bg-white border border-slate-300 p-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-all">
                    <CardElement options={{
                        style: {
                            base: {
                                color: "#0f172a",
                                fontSize: "16px",
                                "::placeholder": { color: "#94a3b8" },
                            },
                            invalid: { color: "#ef4444" },
                        }
                    }} />
                </div>
            </div>

            {error && <div className="text-red-500 text-sm mb-4 font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}

            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Processing..." : `Pay Now`}
            </button>

            <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" /></svg>
                Secure 256-bit SSL Encrypted
            </p>
        </form>
    );
}
