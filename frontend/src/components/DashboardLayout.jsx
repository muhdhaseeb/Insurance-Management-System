import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";

export default function DashboardLayout({ children, role, title }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [userName, setUserName] = useState("User");

    useEffect(() => {
        // Fetch user info for the header
        const fetchUser = async () => {
            try {
                const res = await api.get("/auth/me");
                setUserName(res.data.data.name);
            } catch (err) {
                console.error("Failed to load user info");
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const isActive = (path) => location.pathname === path;

    // Sidebar link styles
    const linkClass = (path) => `
    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200
    ${isActive(path)
            ? "bg-blue-50 text-blue-700"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
  `;

    return (
        <div className="flex min-h-screen bg-slate-100 text-slate-900 font-sans">
            {/* Sidebar */}
            <aside className="w-[260px] bg-white border-r border-slate-200 fixed h-full z-10 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-200">
                    <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        TalentFlow
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {/* Customer Links */}
                    {(role === "CUSTOMER" || !role) && (
                        <>
                            <button onClick={() => navigate("/")} className={linkClass("/")}>
                                <span>🏠</span> Dashboard
                            </button>
                            <button onClick={() => navigate("/policies")} className={linkClass("/policies")}>
                                <span>📄</span> Policies
                            </button>
                            <button onClick={() => navigate("/claims")} className={linkClass("/claims")}>
                                <span>⚠️</span> Claims
                            </button>
                            <button onClick={() => navigate("/wizard")} className={linkClass("/wizard")}>
                                <span>🪄</span> AI Advisor
                            </button>
                        </>
                    )}

                    {/* Admin Links */}
                    {role === "ADMIN" && (
                        <>
                            <button onClick={() => navigate("/admin")} className={linkClass("/admin")}>
                                <span>📊</span> Overview
                            </button>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-6 mb-2 px-4">Management</div>
                            <button onClick={() => navigate("/admin/users")} className={linkClass("/admin/users")}>
                                <span>users</span> Users
                            </button>
                            <button onClick={() => navigate("/admin/reports")} className={linkClass("/admin/reports")}>
                                <span>📑</span> Reports
                            </button>
                        </>
                    )}

                    {/* Agent Links */}
                    {role === "AGENT" && (
                        <>
                            <button onClick={() => navigate("/agent")} className={linkClass("/agent")}>
                                <span>💼</span> Agent Portal
                            </button>
                            <button onClick={() => navigate("/agent/leads")} className={linkClass("/agent/leads")}>
                                <span>📞</span> Leads
                            </button>
                        </>
                    )}

                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-6 mb-2 px-4">Account</div>
                    <button onClick={() => navigate("/profile")} className={linkClass("/profile")}>
                        <span>👤</span> Profile
                    </button>
                    <button onClick={() => navigate("/chat-history")} className={linkClass("/chat-history")}>
                        <span>💬</span> Chat History
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
                    >
                        <span>🚪</span> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
                {/* Navbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
                    <h1 className="text-xl font-bold text-slate-900">{title || "Dashboard"}</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500">Welcome, <span className="font-semibold text-slate-900">{userName}</span></span>
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 space-y-8 bg-slate-100 overflow-y-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
