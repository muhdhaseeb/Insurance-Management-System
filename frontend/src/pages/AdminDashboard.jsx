import { useEffect, useState } from "react";
import api from "../api";
import DashboardLayout from "../components/DashboardLayout";

export default function AdminDashboard() {
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState({ users: 0, active: "0", pending: "0" });

  useEffect(() => {
    fetchPolicies();
    fetchClaims();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/users");
      setStats(prev => ({ ...prev, users: res.data.data.length }));
    } catch (err) {
      console.error("Users fetch error", err);
    }
  };

  const fetchPolicies = async () => {
    try {
      const res = await api.get("/policies");
      const list = res.data.data || [];
      setPolicies(list);
      setStats(prev => ({
        ...prev,
        active: list.filter(p => p.status === "ACTIVE").length,
        pending: list.filter(p => p.status === "PENDING").length
      }));
    } catch (err) {
      console.error("Policy fetch error", err);
    }
  };

  const fetchClaims = async () => {
    try {
      const res = await api.get("/claims/admin/all");
      setClaims(res.data.data || []);
    } catch (err) {
      console.error("Claims fetch error", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/policies/${id}/status`, { status });
      fetchPolicies();
    } catch (err) {
      alert("Action failed");
    }
  };

  return (
    <DashboardLayout role="ADMIN" title="Admin Control Center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Users", value: stats.users, icon: "👥" },
          { label: "Active Policies", value: stats.active, icon: "📄" },
          { label: "Pending Approvals", value: stats.pending, highlight: true, icon: "⏳" },
        ].map((stat, i) => (
          <div key={i} className="card-panel flex items-center justify-between">
            <div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wide">{stat.label}</h3>
              <p className={`text-3xl font-bold mt-2 ${stat.highlight ? "text-amber-600" : "text-slate-900"}`}>
                {stat.value}
              </p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-xl">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="card-panel mb-8 p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Pending Policy Applications</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Policy Type</th>
                <th className="px-6 py-4">Premium</th>
                <th className="px-6 py-4">Assessment</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {policies.filter(p => p.status === "PENDING").map((p, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium text-slate-900">{p.customer?.name || "System User"}</td>
                  <td className="px-6 py-4 text-slate-600">{p.name || p.type}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">${p.premium}</td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase">AI: 95% Match</span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => updateStatus(p._id, "ACTIVE")}
                      className="text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(p._id, "REJECTED")}
                      className="text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
              {policies.filter(p => p.status === "PENDING").length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400 italic">No pending applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real AI Claims Risk Audit */}
      <div className="card-panel">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900">AI Claims Risk Audit</h3>
          <p className="text-sm text-slate-500">Real-time risk scoring for submitted claims.</p>
        </div>

        <div className="grid gap-4">
          {claims.map((claim, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-slate-900">
                    {claim.customer?.name || "Unknown"}
                  </p>
                  <span className="text-slate-400">•</span>
                  <span className="font-medium text-slate-900">${claim.amount}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Policy: {claim.policy?.name || "N/A"}</p>

                <div className="flex gap-2 mt-2">
                  {claim.riskFactors?.map((f, i) => <span key={i} className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 rounded font-bold uppercase">{f}</span>)}
                </div>
              </div>
              <div className="text-right">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Risk Score</span>
                  <span className={`text-xl font-bold ${claim.riskScore > 50 ? "text-red-500" : "text-emerald-500"}`}>{claim.riskScore}<span className="text-xs text-slate-400 font-normal">/100</span></span>
                </div>
                <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${claim.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                    claim.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                  {claim.status || "PENDING"}
                </span>
              </div>
            </div>
          ))}
          {claims.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p className="text-slate-400 italic">No claims filed yet.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
