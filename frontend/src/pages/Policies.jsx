import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import DashboardLayout from "../components/DashboardLayout";

export default function Policies() {
  const [policies, setPolicies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/policies/plans").then((res) => setPolicies(res.data.data || []));
  }, []);

  const handleBuyNow = async (plan) => {
    try {
      const res = await api.post("/policies/apply", {
        name: plan.name,
        type: plan.type,
        coverage: plan.coverage,
        premium: plan.premium,
        durationYears: plan.durationYears
      });
      const newPolicyId = res.data.data._id;
      navigate(`/purchase?policyId=${newPolicyId}`);
    } catch (err) {
      console.error("Failed to apply for policy", err);
      alert("Failed to proceed. Please try again.");
    }
  };

  return (
    <DashboardLayout role="CUSTOMER" title="Available Policies">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies.map((p) => (
          <div key={p.id || p._id} className="card-panel flex flex-col justify-between h-full group hover:border-blue-300 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  {p.type}
                </span>
                <span className="text-2xl font-bold text-slate-900">${p.premium}<span className="text-sm font-normal text-slate-500">/mo</span></span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">{p.name}</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                {p.description || "Comprehensive coverage designed to protect what matters most to you."}
              </p>

              <div className="bg-slate-50 rounded-lg p-3 mb-6 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Coverage Limit</p>
                <p className="text-lg font-bold text-slate-900">${p.coverage?.toLocaleString()}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">{p.durationYears} Year Term</span>
              <button
                onClick={() => handleBuyNow(p)}
                className="btn-primary text-sm"
              >
                Select Plan →
              </button>
            </div>
          </div>
        ))}

        {policies.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white border border-slate-200 rounded-xl shadow-sm">
            <p className="text-slate-500">No policies available at the moment.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
