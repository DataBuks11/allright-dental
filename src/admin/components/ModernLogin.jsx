import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, ROLES, DEMO_USERS } from "../context/AuthContext";
import {
  FaTooth,
  FaShieldAlt,
  FaLock,
  FaUser,
  FaKey,
  FaCheckCircle,
  FaArrowRight,
  FaMobileAlt,
  FaRedo
} from "react-icons/fa";

const ModernLogin = () => {
  const navigate = useNavigate();
  const { loginPrimary, verifyMfa, pendingMfaUser, mfaCode, switchRole } = useAuth();

  const [step, setStep] = useState("credentials"); // "credentials" | "mfa"
  const [username, setUsername] = useState("Allrightdental");
  const [password, setPassword] = useState("allrightdental25*");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [rememberDevice, setRememberDevice] = useState(true);

  // Handle Step 1 Login
  const handlePrimarySubmit = (e) => {
    e.preventDefault();
    setError("");
    const res = loginPrimary(username, password);
    if (res.success) {
      if (res.requiresMfa) {
        setStep("mfa");
        setSuccessMsg(`MFA Challenge dispatched via ${res.mfaMethod}! Use code: ${res.demoCode}`);
      } else {
        navigate("/admin/dashboard");
      }
    } else {
      setError(res.message);
    }
  };

  // Handle Step 2 MFA Verification
  const handleMfaSubmit = (e) => {
    e.preventDefault();
    setError("");
    const res = verifyMfa(pin);
    if (res.success) {
      setSuccessMsg("Multi-Factor Authentication verified successfully! Redirecting...");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 800);
    } else {
      setError(res.message);
    }
  };

  // Fast 1-Click Role Direct Login
  const handleQuickRole = (role) => {
    switchRole(role);
    setSuccessMsg(`Logged in directly as ${DEMO_USERS[role].name}!`);
    setTimeout(() => {
      navigate("/admin/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex flex-col justify-center items-center px-4 py-8 font-poppins relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 p-6 text-white text-center relative">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-teal-300 mb-3 shadow-inner border border-white/20">
            <FaTooth className="text-2xl" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">AllRight Dental Portal</h2>
          <p className="text-xs text-blue-200 mt-1">Practice Management & Clinical EHR</p>
          <div className="inline-flex items-center gap-1 mt-3 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-semibold text-emerald-300">
            <FaShieldAlt className="text-[10px]" /> 100% HIPAA & MFA Secured
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <FaCheckCircle className="text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {step === "credentials" ? (
            /* STEP 1: CREDENTIALS */
            <form onSubmit={handlePrimarySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FaUser className="text-slate-400 text-xs" /> Username or Clinic ID
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 font-medium"
                  placeholder="e.g. Allrightdental"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FaLock className="text-slate-400 text-xs" /> Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 font-medium"
                  placeholder="••••••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
              >
                <span>Proceed to 2-Step Verification</span>
                <FaArrowRight className="text-xs" />
              </button>
            </form>
          ) : (
            /* STEP 2: MFA VERIFICATION */
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div className="text-center p-3 rounded-2xl bg-blue-50/70 border border-blue-100">
                <FaMobileAlt className="text-2xl text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-bold text-slate-800">Multi-Factor Authentication (MFA)</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Enter the 6-digit code for <b>{pendingMfaUser?.name}</b>
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-600 text-white font-mono text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  <span>Demo Code:</span>
                  <span className="tracking-wider">{mfaCode}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 text-center">
                  Enter 6-Digit Verification PIN
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center text-xl tracking-widest font-mono font-bold px-3 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900"
                  placeholder="••••••"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Trust this device for 30 days</span>
                </label>
                <button
                  type="button"
                  onClick={() => setPin(mfaCode)}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Auto-Fill Code
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep("credentials")}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-2.5 px-3 rounded-xl shadow-lg shadow-emerald-500/25 transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FaKey className="text-xs" />
                  <span>Verify & Login</span>
                </button>
              </div>
            </form>
          )}

          {/* Quick 1-Click Role Switcher for Testing & Demonstration */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2.5 text-center">
              1-Click Demo Login (Instant Role Testing)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRole(ROLES.SUPER_ADMIN)}
                className="text-left p-2 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group"
              >
                <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Doctor Shalini</p>
                <p className="text-[10px] text-slate-500">SuperAdmin (Full Access)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole(ROLES.RECEPTIONIST)}
                className="text-left p-2 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group"
              >
                <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Receptionist</p>
                <p className="text-[10px] text-slate-500">Front Desk & Intake</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole(ROLES.DOCTOR)}
                className="text-left p-2 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group"
              >
                <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Dr. Vance</p>
                <p className="text-[10px] text-slate-500">Associate Clinician</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole(ROLES.PATIENT)}
                className="text-left p-2 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group"
              >
                <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Piyush Junghare</p>
                <p className="text-[10px] text-slate-500">Patient Portal</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-slate-400 text-xs">
        <p>AllRight Dental Clinic • 229 Plaza Boulevard, Suite 23, Morrisville, PA 19067</p>
        <p className="text-[11px] mt-1 text-slate-500">Compliant with US HIPAA Security Rule § 164.312 & NIST SP 800-63B MFA</p>
      </div>
    </div>
  );
};

export default ModernLogin;

