import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import DashboardLayout from "../components/DashboardLayout";

export default function PolicyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [policy, setPolicy] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const policyRes = await api.get(`/policies/${id}`);
                setPolicy(policyRes.data.data);
                const paymentsRes = await api.get(`/payments/policy/${id}`);
                setPayments(paymentsRes.data.data || []);
            } catch (err) {
                console.error("Failed to load details", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

    if (loading) return <DashboardLayout role="CUSTOMER" title="Details"><div className="p-8 text-slate-500">Loading...</div></DashboardLayout>;
    if (!policy) return <DashboardLayout role="CUSTOMER" title="Details"><div className="p-8 text-slate-500">Policy not found</div></DashboardLayout>;

    const startDate = new Date(policy.createdAt);
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + policy.durationYears);
    const daysRemaining = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <DashboardLayout role="CUSTOMER" title={`Policy #${policy.policyNumber}`}>
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header Card */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-bold uppercase">{policy.type}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${policy.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                                    policy.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {policy.status}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-1">{policy.name}</h1>
                        <p className="text-slate-500">ID: <span className="font-mono text-slate-700">{policy._id}</span></p>
                    </div>
                    <div className="flex gap-3">
                        {policy.paymentStatus === "UNPAID" && (
                            <button onClick={() => navigate(`/purchase?policyId=${policy._id}`)} className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-5 py-2.5 transition duration-200 active:scale-95 font-medium">
                                Pay Premium
                            </button>
                        )}
                        <button className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 rounded-lg px-5 py-2.5 transition duration-200 font-medium">
                            Download PDF
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Coverage Amount</p>
                        <p className="text-2xl font-bold text-slate-900">${policy.coverage?.toLocaleString()}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Monthly Premium</p>
                        <p className="text-2xl font-bold text-slate-900">${policy.premium?.toLocaleString()}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Expires In</p>
                        <p className="text-2xl font-bold text-slate-900">{daysRemaining} <span className="text-sm font-normal text-slate-500">days</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Timeline */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Timeline</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Start Date</span>
                                <span className="font-medium text-slate-900">{startDate.toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">End Date</span>
                                <span className="font-medium text-slate-900">{endDate.toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payments */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Payment History</h3>
                        {payments.length === 0 ? (
                            <p className="text-slate-500 text-sm italic">No records found.</p>
                        ) : (
                            <div className="space-y-3">
                                {payments.map(pay => (
                                    <div key={pay._id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <div>
                                            <p className="text-slate-900 font-bold text-sm">${pay.amount}</p>
                                            <p className="text-xs text-slate-500">{new Date(pay.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                                            {pay.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
