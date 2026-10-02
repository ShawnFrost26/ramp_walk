"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import {
  Shield,
  Lock,
  User,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  UserPlus,
  KeyRound,
  Info,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  // Mode: "login" | "signup"
  const [mode, setMode] = useState<"login" | "signup">("login");

  // Login form state
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sign up form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [isSubmittingSignup, setIsSubmittingSignup] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);

  // 1. Handle Admin Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      setIsLoggingIn(true);
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error(err);
      setLoginError(err.message || "Invalid admin credentials");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 2. Handle Admin Sign Up (Access Request)
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setSignupSuccess(null);

    if (!signupName.trim()) {
      setSignupError("Please enter your Full Name.");
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes("@")) {
      setSignupError("Please provide a valid Email ID.");
      return;
    }
    if (!/^[0-9]{10}$/.test(signupPhone.trim())) {
      setSignupError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setIsSubmittingSignup(true);
      const res = await fetch("/api/admin/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName.trim(),
          email: signupEmail.trim(),
          phone: signupPhone.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit admin request");
      }

      setSignupSuccess(data.message || "Access request submitted for approval.");
      // Pre-fill login credentials for user convenience
      setUsername(signupName.trim());
      setPassword(signupEmail.trim().toLowerCase());
    } catch (err: any) {
      setSignupError(err.message || "Something went wrong while submitting request.");
    } finally {
      setIsSubmittingSignup(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-grid-pattern">
        <div className="w-full max-w-lg space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-[#1E293B] border border-slate-200 shadow-sm">
              <Shield className="h-7 w-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Organizer Admin Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Dharti Aaba Veer Birsa Munda Jayanti 2026 • Authorized Officials & Secretariat
            </p>
          </div>

          {/* Toggle Tabs (Login vs Sign Up) */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setLoginError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === "login"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <KeyRound className="h-4 w-4" />
              <span>Admin Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setSignupError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === "signup"
                  ? "bg-[#1E293B] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserPlus className="h-4 w-4" />
              <span>Sign Up for Access</span>
              <span className="rounded-full bg-amber-500/20 text-amber-800 text-[10px] font-black px-1.5 py-0.2 border border-amber-300">
                Max 20
              </span>
            </button>
          </div>

          {/* CARD CONTAINER */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-5">
            {/* MODE 1: LOGIN */}
            {mode === "login" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Sign in to Admin Dashboard</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Main Creator Admin or Approved Secretariat Members.
                  </p>
                </div>

                {loginError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-700">
                        Admin Username
                      </label>
                      <span className="text-[10px] text-slate-400">
                        Main Admin: <code className="text-slate-600">admin</code> | Member: Registered Name
                      </span>
                    </div>
                    <div className="relative">
                      <User className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. admin or Your Exact Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#1E293B] focus:ring-2 focus:ring-[#1E293B]/20"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      *For member admins: Use the exact spelling and capitalization used when requesting access.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-700">
                        Admin Secret Key
                      </label>
                      <span className="text-[10px] text-slate-400">
                        Member: Your Registered Email ID
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="Enter secret key or your registered email"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#1E293B] focus:ring-2 focus:ring-[#1E293B]/20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold bg-[#1E293B] hover:bg-[#0F172A] text-white shadow-md transition-all disabled:opacity-50 mt-3"
                  >
                    {isLoggingIn ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Enter Admin Dashboard</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Need admin access?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setSignupError(null);
                    }}
                    className="font-bold text-[#1E293B] hover:underline flex items-center gap-1"
                  >
                    <span>Request Admin Access (Sign Up)</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}

            {/* MODE 2: SIGN UP / REQUEST ACCESS */}
            {mode === "signup" && (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-900">Request Admin Access</h2>
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg border border-slate-200">
                      Cap: 20 Members Max
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Submit your details for review and approval by the Main Creator Admin.
                  </p>
                </div>

                {/* Instructions alert */}
                <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs text-blue-900 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Info className="h-4 w-4 text-blue-700 shrink-0" />
                    <span>How Login Works Once Approved:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-blue-800 ml-1">
                    <li>
                      <strong>Username:</strong> Your Full Name entered below (same spelling & capslock).
                    </li>
                    <li>
                      <strong>Secret Key:</strong> Your Email ID entered below.
                    </li>
                    <li>
                      Once approved by the Main Admin, you will have delegate view & edit access.
                    </li>
                  </ul>
                </div>

                {signupError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                    <span>{signupError}</span>
                  </div>
                )}

                {signupSuccess && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-bold">Request Submitted Successfully!</p>
                        <p>{signupSuccess}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setSignupSuccess(null);
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-sm"
                    >
                      <span>Proceed to Admin Login</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {!signupSuccess && (
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Full Name (Exact Username) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#1E293B] focus:ring-2 focus:ring-[#1E293B]/20"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">
                        ⚠️ Remember this exact spelling & caps. You must enter this exact text as your Username.
                      </p>
                    </div>

                    {/* Email ID */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Official Email ID (Secret Key) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="e.g. rahul.sharma@example.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#1E293B] focus:ring-2 focus:ring-[#1E293B]/20"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">
                        🔑 This Email ID will serve as your Admin Secret Key during login.
                      </p>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="10-digit mobile number"
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value.replace(/[^0-9]/g, ""))}
                          className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#1E293B] focus:ring-2 focus:ring-[#1E293B]/20"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Required for verification by the Main Admin.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingSignup}
                      className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold bg-[#1E293B] hover:bg-[#0F172A] text-white shadow-md transition-all disabled:opacity-50 mt-4"
                    >
                      {isSubmittingSignup ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit For Approval</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Already approved?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setSignupError(null);
                    }}
                    className="font-bold text-[#1E293B] hover:underline"
                  >
                    Back to Admin Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
