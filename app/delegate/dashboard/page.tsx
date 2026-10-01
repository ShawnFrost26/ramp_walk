"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { DigitalPassCard } from "@/components/delegate/DigitalPassCard";
import { EVENT_DETAILS } from "@/lib/constants/event";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  UserCheck,
  Award,
  Sparkles,
  LogOut,
  RefreshCw,
  Calendar,
  MapPin,
  CreditCard,
  User,
  ShieldCheck,
  CheckCircle2,
  FileText,
} from "lucide-react";

export default function DelegateDashboardPage() {
  const router = useRouter();
  const [delegate, setDelegate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pass" | "details" | "receipt">("pass");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/delegate/me");
        if (!res.ok) {
          router.push("/delegate/login");
          return;
        }
        const data = await res.json();
        setDelegate(data.delegate);
      } catch (err) {
        console.error("Failed to load delegate profile:", err);
        router.push("/delegate/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/delegate/logout", { method: "POST" });
    router.push("/delegate/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-12">
          <RefreshCw className="h-8 w-8 animate-spin text-amber-500 mb-3" />
          <p className="text-sm font-medium text-slate-400">Loading Delegate Dashboard...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
        
        {/* Delegate Header Banner */}
        <div className="rounded-3xl border border-slate-800 bg-[#0C1220]/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center sm:text-left">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-md shrink-0">
              <UserCheck className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl font-black text-white">{delegate?.full_name}</h1>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-300">
                  CONFIRMED DELEGATE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Reg No: <strong className="text-amber-400 font-mono">{delegate?.registration_number}</strong> •{" "}
                Category: <strong className="text-slate-200">{delegate?.category}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all shrink-0"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("pass")}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "pass"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            Digital Event Pass
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "details"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            Complete Bio-Data
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("receipt")}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "receipt"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            Payment Receipt
          </button>
        </div>

        {/* TAB 1: DIGITAL PASS */}
        {activeTab === "pass" && <DigitalPassCard delegate={delegate} />}

        {/* TAB 2: COMPLETE REGISTRATION RECORD */}
        {activeTab === "details" && (
          <div className="rounded-2xl border border-slate-800 bg-[#0C1220]/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-400" />
                <span>Audition Registration Bio-Data</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Submitted record for jury evaluation and secretariat files.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-xs">
              <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-1">
                <span className="text-slate-500 font-semibold">Full Name</span>
                <p className="text-sm font-bold text-white">{delegate?.full_name}</p>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-1">
                <span className="text-slate-500 font-semibold">Parent / Guardian</span>
                <p className="text-sm font-bold text-white">{delegate?.guardian_name}</p>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-1">
                <span className="text-slate-500 font-semibold">Date of Birth & Gender</span>
                <p className="text-sm font-bold text-white">
                  {formatDate(delegate?.date_of_birth)} ({delegate?.gender})
                </p>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-1">
                <span className="text-slate-500 font-semibold">Tribal Community</span>
                <p className="text-sm font-bold text-amber-400">
                  {delegate?.tribal_community || "Not Specified"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-1">
                <span className="text-slate-500 font-semibold">Mobile & WhatsApp</span>
                <p className="text-sm font-bold text-white">{delegate?.mobile_number}</p>
                {delegate?.whatsapp_number && (
                  <p className="text-[11px] text-slate-400">WA: {delegate.whatsapp_number}</p>
                )}
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-1">
                <span className="text-slate-500 font-semibold">Email ID</span>
                <p className="text-sm font-bold text-white truncate">{delegate?.email}</p>
              </div>

              <div className="sm:col-span-2 md:col-span-3 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-1">
                <span className="text-slate-500 font-semibold">Residential Address</span>
                <p className="text-sm text-slate-200">{delegate?.full_address}</p>
                <p className="text-xs text-slate-400">
                  {delegate?.city_or_village}, {delegate?.district}, {delegate?.state} - {delegate?.pincode}
                </p>
              </div>

              <div className="sm:col-span-2 md:col-span-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  Cultural Attire & Presentation
                </span>
                <p className="text-sm font-semibold text-white">
                  {delegate?.attire_name || "Tribal Heritage Attire"} ({delegate?.attire_representation})
                </p>
                {delegate?.attire_description && (
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    &ldquo;{delegate.attire_description}&rdquo;
                  </p>
                )}
                {delegate?.special_talent && (
                  <div className="pt-2 text-xs text-slate-300">
                    <strong className="text-amber-400">Special Talent / Intro:</strong> {delegate.special_talent}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT RECEIPT */}
        {activeTab === "receipt" && (
          <div className="rounded-2xl border border-slate-800 bg-[#0C1220]/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6 max-w-2xl mx-auto">
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-400" />
                  <span>Payment Receipt</span>
                </h3>
                <p className="text-xs text-slate-400">Official proof of registration payment</p>
              </div>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300">
                PAID & VERIFIED
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-800 text-slate-400">
                <span>Receipt For:</span>
                <span className="font-semibold text-white">
                  Dharti Aaba Birsa Jayanti 2026 Ramp Walk Registration
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800 text-slate-400">
                <span>Registration Number:</span>
                <span className="font-mono font-bold text-amber-400">{delegate?.registration_number}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800 text-slate-400">
                <span>Participant Name:</span>
                <span className="font-semibold text-white">{delegate?.full_name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800 text-slate-400">
                <span>Payment Reference:</span>
                <span className="font-mono text-slate-300">
                  {delegate?.payment?.razorpay_payment_id || "pay_razorpay_verified"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800 text-slate-400">
                <span>Payment Date:</span>
                <span className="text-slate-300">
                  {formatDate(delegate?.confirmed_at || delegate?.created_at)}
                </span>
              </div>
              <div className="flex justify-between items-center py-4 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 mt-4">
                <span className="text-sm font-bold text-amber-300">Total Amount Paid:</span>
                <span className="text-2xl font-black text-amber-400">
                  {formatCurrency(EVENT_DETAILS.registrationFee)}
                </span>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
