import { useEffect, useState } from "react";
import api from "../api";
import DashboardLayout from "../components/DashboardLayout";
import { Link } from "react-router-dom";

export default function CustomerDashboard() {
  const [stats, setStats] = useState({ activePolicies: 0, pendingClaims: 0, totalPremium: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [policiesRes, claimsRes] = await Promise.all([
          api.get("/policies/my"),
          api.get("/claims")
        ]);

        const policies = policiesRes.data.data || [];
        const claims = claimsRes.data.data || [];

        const activeParams = policies.filter(p => p.status === 'ACTIVE');
        const activeCount = activeParams.length;
        const premiumSum = activeParams.reduce((sum, p) => sum + p.premium, 0);
        const pendingClaimsCount = claims.filter(c => c.status === 'PENDING').length;

        setStats({
          activePolicies: activeCount,
          totalPremium: premiumSum,
          pendingClaims: pendingClaimsCount
        });
      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <DashboardLayout role="CUSTOMER" title="Dashboard">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout role="CUSTOMER" title="Overview">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-slate-900">Welcome back!</h2>
          <p className="text-slate-500">Your insurance portfolio is looking healthy today.</p>
        </div>
        <Link to="/wizard" className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition shadow-sm active:scale-95">
          Find New Coverage
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-panel flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-2xl">
            📄
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Active Policies</p>
            <p className="text-3xl font-bold text-slate-900">{stats.activePolicies}</p>
          </div>
        </div>

        <div className="card-panel flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-2xl">
            🛡️
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Coverage</p>
            <p className="text-3xl font-bold text-slate-900">${stats.totalPremium.toLocaleString()}<span className="text-sm text-slate-400 font-normal">/mo</span></p>
          </div>
        </div>

        <div className="card-panel flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 text-2xl">
            ⚠️
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Pending Claims</p>
            <p className="text-3xl font-bold text-slate-900">{stats.pendingClaims}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions & AI Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-panel">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/claims" className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-center group">
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">📝</span>
              <span className="font-medium text-slate-700">File a Claim</span>
            </Link>
            <Link to="/policies" className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-center group">
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🔍</span>
              <span className="font-medium text-slate-700">Browse Plans</span>
            </Link>
            <Link to="/profile" className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-center group">
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">👤</span>
              <span className="font-medium text-slate-700">Update Profile</span>
            </Link>
            <Link to="/chat-history" className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-center group">
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">💬</span>
              <span className="font-medium text-slate-700">AI Support</span>
            </Link>
          </div>
        </div>

        <div className="card-panel">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
                🤖
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Risk Assessment</h3>
            </div>

            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
              Our AI analysis suggests you have excellent coverage for your current lifestyle.
              Maintain your safe driving record to unlock an additional 5% discount next month.
            </p>

            <div className="flex items-center justify-between">
              <div className="bg-slate-50 rounded-lg px-4 py-2 border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Safety Score</p>
                <p className="text-2xl font-bold text-slate-900">94/100</p>
              </div>
              <Link to="/wizard" className="text-sm font-bold text-slate-900 hover:text-blue-600 hover:underline transition-colors">View Details →</Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
