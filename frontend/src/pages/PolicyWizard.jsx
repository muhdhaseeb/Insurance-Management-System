import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api";

export default function PolicyWizard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        age: "",
        income: "",
        dependents: "",
        riskTolerance: "Medium"
    });
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const getRecommendation = async () => {
        setLoading(true);
        try {
            // FIX: Changed endpoint from /wizard/recommend to /recommendations/suggest
            const res = await api.post("/recommendations/suggest", formData);
            // Backend returns { success: true, data: [policies] } or similar
            // Logic assumes backend returns a list, we pick the first one or the "best" one

            const bestMatch = res.data.data ? res.data.data[0] : null;

            if (bestMatch) {
                setRecommendation({
                    name: bestMatch.name,
                    reason: bestMatch.description || "Matches your risk profile and income level.",
                    estimatedPremium: bestMatch.premium
                });
                nextStep();
            } else {
                alert("No suitable policies found for your criteria.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to get recommendation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="CUSTOMER" title="AI Insurance Advisor">
            <div className="max-w-2xl mx-auto">
                <div className="card-panel">

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                            <span>Profile</span>
                            <span>Evaluate</span>
                            <span>Result</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-slate-900 transition-all duration-300"
                                style={{ width: `${(step / 3) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {step === 1 && (
                        <div className="animate-fade-in-up">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Tell us about yourself</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Age</label>
                                    <input type="number" name="age" value={formData.age} onChange={handleChange} className="input-field" placeholder="e.g. 30" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Annual Income</label>
                                    <input type="number" name="income" value={formData.income} onChange={handleChange} className="input-field" placeholder="$50,000" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Dependents</label>
                                    <input type="number" name="dependents" value={formData.dependents} onChange={handleChange} className="input-field" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Risk Tolerance</label>
                                    <select name="riskTolerance" value={formData.riskTolerance} onChange={handleChange} className="input-field cursor-pointer">
                                        <option value="Low">Low - Safety First</option>
                                        <option value="Medium">Medium - Balanced</option>
                                        <option value="High">High - Growth Focus</option>
                                    </select>
                                </div>
                            </div>
                            <button onClick={nextStep} className="btn-primary w-full md:w-auto">Next Step →</button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="text-center py-12 animate-fade-in-up">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                                🤖
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Analyzing your profile...</h2>
                            <p className="text-slate-500 max-w-md mx-auto mb-8">
                                Our AI is comparing 50+ policy combinations to find the perfect match for your financial situation.
                            </p>
                            <button onClick={getRecommendation} disabled={loading} className="btn-primary w-full md:w-auto min-w-[200px]">
                                {loading ? "Processing..." : "Reveal Recommendation"}
                            </button>
                        </div>
                    )}

                    {step === 3 && recommendation && (
                        <div className="animate-fade-in-up">
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center mb-8">
                                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide bg-emerald-100 px-3 py-1 rounded-full mb-4 inline-block">Top Match</span>
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">{recommendation.name || "Premium Life Plan"}</h2>
                                <p className="text-slate-600 mb-6 max-w-lg mx-auto">{recommendation.reason || "Based on your income and dependents, this plan offers the best long-term security."}</p>
                                <div className="text-4xl font-bold text-slate-900 mb-1">${recommendation.estimatedPremium || 120}<span className="text-lg font-normal text-slate-500">/mo</span></div>
                            </div>

                            <div className="flex justify-between">
                                <button onClick={() => setStep(1)} className="btn-secondary">Start Over</button>
                                <button onClick={() => window.location.href = '/policies'} className="btn-primary">View All Plans</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
