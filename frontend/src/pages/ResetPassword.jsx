import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setStatus({ type: "error", message: "Passwords do not match" });
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/auth/reset-password", { token, newPassword });
            setStatus({ type: "success", message: res.data.message });
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        } catch (err) {
            setStatus({ type: "error", message: err.response?.data?.message || "Reset failed" });
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6">
                <div className="card-panel text-center max-w-sm w-full">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Invalid Link</h2>
                    <p className="text-slate-500 mb-6">This password reset link is invalid or has expired.</p>
                    <a href="/login" className="btn-primary inline-block">Back to Login</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6">
            <div className="w-full max-w-md card-panel shadow-sm animate-fade-in-up">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h2>
                    <p className="text-slate-500 text-sm">Create a strong new password for your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">New Password</label>
                        <input
                            required
                            className="input-field"
                            type="password"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Confirm Password</label>
                        <input
                            required
                            className="input-field"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {status.message && (
                        <div className={`p-4 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            {status.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-lg transition-all shadow-sm active:scale-95 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Resetting..." : "Save New Password"}
                    </button>

                    <div className="text-center mt-6">
                        <a href="/login" className="text-xs text-slate-500 hover:text-slate-700 font-medium hover:underline">
                            Back to Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
