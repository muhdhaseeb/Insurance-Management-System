import { useEffect, useState } from "react";
import api from "../api";
import DashboardLayout from "../components/DashboardLayout";

export default function AgentDashboard() {
  const [sales, setSales] = useState(0);

  useEffect(() => {
    api.get("/policies").then(res => {
      const list = res.data.data || [];
      const total = list.reduce((acc, p) => acc + (p.premium || 0), 0);
      setSales(total);
    });
  }, []);

  return (
    <DashboardLayout role="AGENT" title="Agent Portal">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card-panel">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            Immediate Actions
          </h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center text-sm p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-300 transition cursor-pointer">
              <span className="font-medium text-slate-700">Follow up with new leads</span>
              <span className="text-xs font-bold bg-red-50 text-red-600 border border-red-100 px-2.5 py-1 rounded-full uppercase tracking-wide">High Priority</span>
            </li>
            <li className="flex justify-between items-center text-sm p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-300 transition cursor-pointer">
              <span className="font-medium text-slate-700">Policy Renewal Reminders</span>
              <span className="text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wide">Weekly</span>
            </li>
          </ul>
        </div>

        <div className="card-panel text-center flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <svg className="w-32 h-32 text-slate-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
          </div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Portfolio Value</h3>
          <div className="text-5xl font-bold text-slate-900 mb-2">
            ${sales.toLocaleString()}
          </div>
          <p className="text-slate-400 text-sm font-medium">Global Managed Premium</p>

          <div className="mt-6 pt-6 border-t border-slate-100 flex justify-center gap-8">
            <div className="text-center">
              <span className="block text-xl font-bold text-emerald-600">+12%</span>
              <span className="text-xs text-slate-400 font-bold uppercase">MoM Growth</span>
            </div>
            <div className="h-full w-px bg-slate-100"></div>
            <div className="text-center">
              <span className="block text-xl font-bold text-blue-600">85</span>
              <span className="text-xs text-slate-400 font-bold uppercase">Active Clients</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
