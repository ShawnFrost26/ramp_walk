"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { UserCheck, ShieldCheck, AlertCircle, ArrowRight, RefreshCw, Calendar, Phone } from "lucide-react";

export default function DelegateLoginPage() {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = mobileNumber.trim().replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      setError("Please enter your registered 10-digit mobile number");
      return;
    }

    if (!dateOfBirth) {
      setError("Please select your date of birth as provided during registration");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/delegate/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber: cleanPhone,
          dateOfBirth,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/delegate/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-grid-pattern">
        <div className="w-full max-w-md space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-[#A26715] border border-amber-200 shadow-sm">
              <UserCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Delegate Portal Login
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Log in at any time with your Phone Number and Date of Birth to access your official pass or complete a pending registration.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-600 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Registered Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    placeholder="9876543210"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#A26715] focus:ring-2 focus:ring-[#A26715]/20 font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  The 10-digit mobile number used when submitting your entry.
                </p>
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Date of Birth (DOB)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#A26715] focus:ring-2 focus:ring-[#A26715]/20 font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Matches your birth date recorded in Section I.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold bg-[#A26715] hover:bg-[#8B5711] text-white shadow-md transition-all disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Access Delegate Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="border-t border-slate-200 pt-4 text-center">
              <p className="text-xs text-slate-500">
                Haven&apos;t registered yet?{" "}
                <Link href="/register" className="text-[#900C22] font-semibold hover:underline">
                  Register for Auditions
                </Link>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Encrypted Session • Official Veer Birsa Munda Portal</span>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
