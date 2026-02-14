import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "CUSTOMER",
        phone: "",
        age: "",
        occupation: "",
        address: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submit = async () => {
        try {
            await api.post("/auth/register", formData);
            alert("Registration Successful. Please Login.");
            navigate("/login");
        } catch (err) {
            alert("Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 py-12 px-6 font-sans">
            <div className="w-full max-w-2xl card-panel shadow-sm">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h2>
                    <p className="text-slate-500 font-medium text-sm">Join TalentFlow for premium insurance services</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Full Name</label>
                        <input name="name" className="input-field" placeholder="John Doe" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Email</label>
                        <input name="email" type="email" className="input-field" placeholder="john@example.com" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Password</label>
                        <input name="password" type="password" className="input-field" placeholder="••••••••" onChange={handleChange} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Phone Number</label>
                        <input name="phone" className="input-field" placeholder="+1 (555) 000-0000" onChange={handleChange} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Age</label>
                        <input name="age" type="number" className="input-field" placeholder="25" onChange={handleChange} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Occupation</label>
                        <input name="occupation" className="input-field" placeholder="Software Engineer" onChange={handleChange} />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Address</label>
                        <textarea name="address" className="input-field h-20" placeholder="123 Main St, City, Country" onChange={handleChange}></textarea>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Join As</label>
                        <select
                            className="input-field cursor-pointer"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="CUSTOMER">Customer Account</option>
                            <option value="AGENT">Insurance Agent</option>
                            <option value="ADMIN">System Admin</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-lg transition-all shadow-sm active:scale-95"
                            onClick={submit}
                        >
                            Complete Registration
                        </button>

                        <div className="text-center mt-6">
                            <span className="text-slate-500 text-sm">Already have an account? </span>
                            <a href="/login" className="text-blue-600 hover:text-blue-700 font-bold hover:underline text-sm">Sign In</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
