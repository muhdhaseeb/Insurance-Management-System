import { useEffect, useState } from "react";
import api from "../api";
import DashboardLayout from "../components/DashboardLayout";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        api.get("/auth/me")
            .then((res) => {
                if (res.data && res.data.data) {
                    setUser(res.data.data);
                    setFormData(res.data.data); // Init form data
                } else {
                    setError(true);
                }
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaveLoading(true);
        try {
            const res = await api.put("/auth/profile", formData);
            if (res.data.success) {
                setUser(res.data.data);
                setIsEditing(false);
                alert("Profile Updated Successfully");
            }
        } catch (err) {
            alert("Failed to update profile");
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) return <DashboardLayout title="Profile"><div className="p-8"><div className="animate-pulse bg-slate-200 h-6 w-48 rounded mb-4"></div><div className="animate-pulse bg-slate-200 h-64 w-full rounded-xl"></div></div></DashboardLayout>;

    if (error || !user) return (
        <DashboardLayout title="Profile">
            <div className="p-8 text-center">
                <div className="text-red-500 font-bold mb-2">⚠ Application Error</div>
                <p className="text-slate-500 text-sm mb-4">Unable to load profile data.</p>
                <div className="flex justify-center gap-4">
                    <button onClick={() => window.location.reload()} className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline">Retry</button>
                    <button onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }} className="text-sm font-bold text-slate-500 hover:text-slate-700 hover:underline">Log Out</button>
                </div>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout title="My Profile" role={user.role || "CUSTOMER"}>
            <div className="max-w-2xl mx-auto">
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center mb-8">
                    <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-4xl text-white font-bold mx-auto mb-4 border-4 border-slate-100">
                        {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{user.name || "Unknown User"}</h2>
                    <p className="text-slate-500 mb-2">{user.email || "No Email"}</p>
                    <span className="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        {user.role || "GUEST"} Account
                    </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-2">
                        <h3 className="text-lg font-bold text-slate-900">Account Details</h3>
                        {isEditing && (
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-wide">Editing Mode</span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Full Name</label>
                            <input
                                name="name"
                                value={isEditing ? formData.name : user.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full border rounded-lg px-4 py-2.5 text-slate-900 font-medium transition ${isEditing ? 'bg-white border-blue-500 ring-2 ring-blue-100' : 'bg-slate-50 border-slate-200 cursor-not-allowed'
                                    }`}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email Address</label>
                            <input
                                disabled
                                value={user.email}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-500 font-medium cursor-not-allowed"
                                title="Email cannot be changed"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Phone</label>
                            <input
                                name="phone"
                                value={isEditing ? (formData.phone || "") : (user.phone || "N/A")}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full border rounded-lg px-4 py-2.5 text-slate-900 font-medium transition ${isEditing ? 'bg-white border-blue-500 ring-2 ring-blue-100' : 'bg-slate-50 border-slate-200 cursor-not-allowed'
                                    }`}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Occupation</label>
                            <input
                                name="occupation"
                                value={isEditing ? (formData.occupation || "") : (user.occupation || "N/A")}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full border rounded-lg px-4 py-2.5 text-slate-900 font-medium transition ${isEditing ? 'bg-white border-blue-500 ring-2 ring-blue-100' : 'bg-slate-50 border-slate-200 cursor-not-allowed'
                                    }`}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Address</label>
                            <textarea
                                name="address"
                                value={isEditing ? (formData.address || "") : (user.address || "N/A")}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full border rounded-lg px-4 py-2.5 text-slate-900 font-medium transition ${isEditing ? 'bg-white border-blue-500 ring-2 ring-blue-100' : 'bg-slate-50 border-slate-200 cursor-not-allowed'
                                    }`}
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData(user); // Reset changes
                                    }}
                                    className="px-6 py-2.5 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saveLoading}
                                    className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-emerald-700 transition shadow-sm active:scale-95 disabled:opacity-50"
                                >
                                    {saveLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition shadow-sm active:scale-95"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
