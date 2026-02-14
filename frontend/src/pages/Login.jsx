import { useState } from "react";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Creds, 2: OTP

  const submit = async () => {
    try {
      if (step === 1) {
        const res = await api.post("/auth/login", { email, password }, { withCredentials: true });
        if (res.data.requireOtp) {
          setStep(2);
        } else {
          window.location.href = "/";
        }
      } else {
        const res = await api.post("/auth/verify-otp", { email, otp }, { withCredentials: true });
        localStorage.setItem("token", res.data.accessToken);
        if (res.data.role === 'ADMIN') window.location.href = "/admin";
        else if (res.data.role === 'AGENT') window.location.href = "/agent";
        else window.location.href = "/";
      }
    } catch (err) {
      alert(step === 1 ? "Login failed" : "Invalid OTP");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first");
      return;
    }
    try {
      await api.post("/auth/forgot-password", { email });
      alert("Reset link sent! Check the backend console.");
    } catch (err) {
      alert("Failed to send reset link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6 font-sans">
      <div className="w-full max-w-md card-panel shadow-sm">

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-lg mx-auto flex items-center justify-center mb-4 shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {step === 1 ? "Welcome Back" : "Security Check"}
          </h2>
          <p className="text-slate-500 font-medium text-sm">
            {step === 1 ? "Sign in to your insurance portal" : `Enter the OTP sent to ${email}`}
          </p>
        </div>

        <div className="space-y-5">
          {step === 1 ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Email Address</label>
                <input
                  className="input-field"
                  type="email"
                  placeholder="john@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Verify OTP</label>
              <input
                className="input-field text-center tracking-[0.5em] text-2xl font-bold"
                maxLength={6}
                placeholder="000000"
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          )}

          <button
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-lg transition-all shadow-sm active:scale-95"
            onClick={submit}
          >
            {step === 1 ? "Sign In" : "Verify & Continue"}
          </button>

          {step === 1 ? (
            <div className="text-center mt-6 space-y-4">
              <div className="text-sm">
                <span className="text-slate-500">Don't have an account? </span>
                <a href="/register" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">Create Account</a>
              </div>
              <button
                onClick={handleForgotPassword}
                className="text-xs text-slate-400 hover:text-slate-600 font-medium block mx-auto hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          ) : (
            <button
              onClick={() => setStep(1)}
              className="w-full text-center mt-4 text-slate-500 hover:text-slate-700 text-sm font-medium"
            >
              Back to Login
            </button>
          )}
        </div>
      </div>

      <div className="fixed bottom-6 text-center w-full text-xs text-slate-400">
        &copy; 2026 TalentFlow Insurance. Secure & Encrypted.
      </div>
    </div>
  );
}
