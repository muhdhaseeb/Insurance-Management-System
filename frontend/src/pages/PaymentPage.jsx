import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../components/PaymentForm";
import DashboardLayout from "../components/DashboardLayout";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function PaymentPage() {
    return (
        <DashboardLayout role="CUSTOMER" title="Payment Gateway">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Complete Your Payment</h2>
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                        <Elements stripe={stripePromise}>
                            <PaymentForm />
                        </Elements>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
