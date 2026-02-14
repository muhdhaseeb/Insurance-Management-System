import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import DashboardLayout from "../components/DashboardLayout";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ policy, clientSecret }) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) return;

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: { name: "Customer Name" }, // Replace with actual user name if available
            },
        });

        if (result.error) {
            setError(result.error.message);
            setLoading(false);
        } else {
            if (result.paymentIntent.status === "succeeded") {
                await api.post("/payments/confirm", {
                    paymentIntentId: result.paymentIntent.id,
                    policyId: policy._id
                });
                alert("Payment Successful!");
                navigate("/policies");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#0f172a',
                            '::placeholder': { color: '#94a3b8' },
                        },
                        invalid: { color: '#ef4444' },
                    },
                }} />
            </div>
            {error && <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-lg hover:bg-slate-800 transition shadow-sm active:scale-95 disabled:opacity-50"
            >
                {loading ? "Processing..." : `Pay $${policy.premium}`}
            </button>
        </form>
    );
}

export default function PolicyPurchase() {
    const [searchParams] = useSearchParams();
    const policyId = searchParams.get("policyId");
    const [policy, setPolicy] = useState(null);
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        if (policyId) {
            api.get(`/policies/${policyId}`).then((res) => {
                setPolicy(res.data.data);
            });
            api.post("/payments/create-intent", { policyId }).then((res) => {
                setClientSecret(res.data.clientSecret);
            });
        }
    }, [policyId]);

    if (!policy || !clientSecret) return <DashboardLayout role="CUSTOMER" title="Checkout"><div className="p-8 text-slate-500">Loading checkout...</div></DashboardLayout>;

    return (
        <DashboardLayout role="CUSTOMER" title="Secure Checkout">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div className="card-panel h-fit">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Order Summary</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Policy Name</p>
                            <p className="text-xl font-bold text-slate-900">{policy.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Coverage Type</p>
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase mt-1 inline-block">{policy.type}</span>
                        </div>
                        <div className="flex justify-between items-end pt-4 border-t border-slate-100 mt-4">
                            <span className="text-slate-500 font-medium">Total Due Today</span>
                            <span className="text-3xl font-bold text-slate-900">${policy.premium}</span>
                        </div>
                    </div>
                    <div className="mt-6 text-xs text-slate-400 bg-slate-50 p-3 rounded-lg">
                        🔒 Secure SSL Encryption using Stripe Payments.
                    </div>
                </div>

                {/* Payment Form */}
                <div className="card-panel">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Payment Details</h3>
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm policy={policy} clientSecret={clientSecret} />
                    </Elements>
                </div>
            </div>
        </DashboardLayout>
    );
}
