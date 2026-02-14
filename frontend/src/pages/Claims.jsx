import { useEffect, useState } from "react";
import api from "../api";
import DashboardLayout from "../components/DashboardLayout";

export default function Claims() {
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [files, setFiles] = useState(null);
  const [formData, setFormData] = useState({
    policyId: "",
    amount: "",
    incidentDate: "",
    description: ""
  });

  useEffect(() => {
    api.get("/claims").then((res) => setClaims(res.data.data || []));
    api.get("/policies/my").then((res) => setPolicies(res.data.data || []));
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitClaim = async () => {
    const data = new FormData();
    data.append("policyId", formData.policyId);
    data.append("amount", formData.amount);
    data.append("incidentDate", formData.incidentDate);
    data.append("description", formData.description);
    if (files) Array.from(files).forEach((file) => data.append("documents", file));

    try {
      await api.post("/claims", data, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert("Claim submitted successfully");
      const updated = await api.get("/claims");
      setClaims(updated.data.data || []);
      setFormData({ policyId: "", amount: "", incidentDate: "", description: "" });
      setFiles(null);
    } catch (err) {
      alert("Failed to submit claim.");
    }
  };

  return (
    <DashboardLayout role="CUSTOMER" title="Claims Center">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* File Claim Form */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">1</div>
            <h3 className="text-lg font-bold text-slate-900">File New Claim</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Select Policy</label>
              <select name="policyId" value={formData.policyId} onChange={handleInputChange} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent cursor-pointer">
                <option value="">-- Choose Policy --</option>
                {policies.map(p => <option key={p._id} value={p._id}>{p.name} ({p.policyNumber})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Claim Amount</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-slate-400" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Incident Date</label>
              <input type="date" name="incidentDate" value={formData.incidentDate} onChange={handleInputChange} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Documents</label>
              <input type="file" multiple onChange={(e) => setFiles(e.target.files)} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent h-24" placeholder="Describe what happened..." />
          </div>

          <button onClick={submitClaim} className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-5 py-2.5 transition duration-200 active:scale-95 font-medium">Submit Claim Application</button>
        </div>

        {/* Claims History Table */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Claims History</h3>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-600 text-sm font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {claims.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50 transition duration-150">
                    <td className="px-6 py-4 text-sm text-slate-800">{new Date(c.incidentDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium truncate max-w-xs">{c.description}</td>
                    <td className="px-6 py-4 text-sm text-slate-900 font-bold">${c.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${c.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                          c.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                        }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {claims.length === 0 && (
                  <tr><td colSpan="4" className="text-center py-8 text-slate-500 italic">No claims found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
