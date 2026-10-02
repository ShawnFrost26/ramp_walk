"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { DigitalPassCard } from "@/components/delegate/DigitalPassCard";
import { DelegatePrintSlip } from "@/components/delegate/DelegatePrintSlip";
import { EVENT_DETAILS } from "@/lib/constants/event";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  UserCheck,
  LogOut,
  RefreshCw,
  CreditCard,
  FileText,
  AlertTriangle,
  ArrowRight,
  Lock,
  User,
  CheckCircle2,
  Calendar,
  Sparkles,
  Printer,
} from "lucide-react";

export default function DelegateDashboardPage() {
  const router = useRouter();
  const [delegate, setDelegate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pass" | "details" | "receipt">("pass");
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [photoError, setPhotoError] = useState(false);

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

  const handleResumePayment = () => {
    if (delegate?.id) {
      router.push(`/register/checkout?id=${delegate.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-slate-800">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-12 bg-grid-pattern">
          <RefreshCw className="h-8 w-8 animate-spin text-[#900C22] mb-3" />
          <p className="text-sm font-medium text-slate-500">Loading Delegate Profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const isPending = Boolean(delegate?.isPendingPayment || delegate?.registration_status === "PENDING_PAYMENT" || delegate?.registration_status === "DRAFT");
  const photoUrl = delegate?.photo_url || delegate?.photoPreviewUrl || delegate?.photo_storage_path;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <Navbar />

      <main className="flex-1 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full bg-grid-pattern">
        
        {/* On-Screen Screen Layout (Strictly Hidden During Print) */}
        <div id="dashboard-screen-content" className="space-y-6 sm:space-y-8 print:hidden">

        {/* PENDING PAYMENT NOTICE BANNER */}
        {isPending && (
          <div className="rounded-3xl border-2 border-amber-300 bg-amber-50/90 p-5 sm:p-7 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md shrink-0">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-amber-200/80 px-2 py-0.5 text-[10px] font-black uppercase text-amber-900 tracking-wider">
                      Action Required
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-amber-950">
                      Registration Incomplete — Complete Payment
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-900/80 leading-relaxed max-w-2xl">
                    Your personal information and profile photograph are securely saved in our system. Complete your payment of{" "}
                    <strong>{formatCurrency(EVENT_DETAILS.registrationFee)}</strong> to confirm your audition slot and unlock your official Registration Number and Digital Pass.
                  </p>
                </div>
              </div>

              {/* Direct Resume Payment Button */}
              <button
                type="button"
                onClick={handleResumePayment}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#900C22] hover:bg-[#74091A] text-white px-6 py-3 text-sm font-bold shadow-lg transition-all cursor-pointer shrink-0"
              >
                <span>Continue Payment ({formatCurrency(EVENT_DETAILS.registrationFee)})</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-amber-200 text-xs text-amber-800">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Bio-Data Saved</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Photograph Uploaded & Stored</span>
              </span>
              <span className="inline-flex items-center gap-1 text-amber-900 font-semibold">
                <Lock className="h-3.5 w-3.5 text-amber-600" />
                <span>Pass Issued Upon Payment</span>
              </span>
            </div>
          </div>
        )}

        {/* Delegate Profile Header Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Exact Profile Photo Rendered with Loading & Fallback */}
            <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#900C22] shadow-md bg-slate-100 shrink-0">
              {photoUrl && !photoError ? (
                <>
                  {!photoLoaded && (
                    <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
                      <RefreshCw className="h-4 w-4 text-slate-400 animate-spin" />
                    </div>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt={delegate?.full_name || "Delegate"}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      photoLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setPhotoLoaded(true)}
                    onError={() => setPhotoError(true)}
                  />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 text-xs">
                  <User className="h-8 w-8 text-slate-400 mb-0.5" />
                  <span className="text-[10px] font-semibold text-slate-500">Profile</span>
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 bg-[#900C22] py-0.5 text-center text-[8px] font-bold text-white tracking-wider uppercase">
                {isPending ? "PENDING" : "DELEGATE"}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl font-black text-slate-900">{delegate?.full_name}</h1>
                {isPending ? (
                  <span className="rounded-full bg-amber-100 border border-amber-300 px-3 py-0.5 text-xs font-bold text-amber-800">
                    PENDING PAYMENT
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-700">
                    CONFIRMED DELEGATE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {isPending ? (
                  <>Application Status: <strong className="text-amber-700">Payment Required</strong> • Category: <strong className="text-slate-800">{delegate?.category}</strong></>
                ) : (
                  <>Reg No: <strong className="text-[#900C22] font-mono text-sm">{delegate?.registration_number}</strong> • Category: <strong className="text-slate-800">{delegate?.category}</strong></>
                )}
              </p>
              <p className="text-[11px] text-slate-400">
                {delegate?.city_or_village}, {delegate?.district}, {delegate?.state} • Phone: +91 {delegate?.mobile_number}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isPending && (
              <button
                type="button"
                onClick={handleResumePayment}
                className="flex items-center gap-1.5 rounded-xl bg-[#900C22] hover:bg-[#74091A] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm"
              >
                <span>Complete Payment</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all shrink-0 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("pass")}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "pass"
                ? "bg-[#900C22] text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Digital Event Pass {isPending && "🔒"}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "details"
                ? "bg-[#900C22] text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Complete Bio-Data
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("receipt")}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "receipt"
                ? "bg-[#900C22] text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Payment Receipt {isPending ? "(Pending)" : ""}
          </button>
        </div>

        {/* TAB 1: DIGITAL PASS */}
        {activeTab === "pass" && (
          isPending ? (
            <div className="rounded-3xl border-2 border-dashed border-amber-300 bg-white p-8 sm:p-12 text-center max-w-lg mx-auto shadow-md space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Lock className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Digital Entry Pass Locked
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your digital audition pass will be activated immediately once the registration fee of {formatCurrency(EVENT_DETAILS.registrationFee)} is confirmed.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResumePayment}
                className="inline-flex items-center gap-2 rounded-xl bg-[#900C22] hover:bg-[#74091A] text-white px-6 py-3 text-xs font-bold shadow-lg transition-all"
              >
                <span>Pay ₹{EVENT_DETAILS.registrationFee} & Unlock Pass</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <DigitalPassCard delegate={delegate} />
          )
        )}

        {/* TAB 2: COMPLETE REGISTRATION RECORD */}
        {activeTab === "details" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
            <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#900C22]" />
                  <span>Audition Registration Bio-Data</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Submitted participant record for jury evaluation and secretariat files.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!isPending && (
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-all cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5 text-[#900C22]" />
                    <span>Download A4 PDF</span>
                  </button>
                )}
                {isPending && (
                  <span className="rounded-md bg-amber-100 border border-amber-300 px-2.5 py-1 text-xs font-bold text-amber-800">
                    Status: Pending Payment
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                <span className="text-slate-500 font-semibold">Full Name</span>
                <p className="text-sm font-bold text-slate-900">{delegate?.full_name}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                <span className="text-slate-500 font-semibold">Parent / Guardian</span>
                <p className="text-sm font-bold text-slate-900">{delegate?.guardian_name}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                <span className="text-slate-500 font-semibold">Date of Birth & Gender</span>
                <p className="text-sm font-bold text-slate-900">
                  {formatDate(delegate?.date_of_birth)} ({delegate?.gender})
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                <span className="text-slate-500 font-semibold">Tribal Community</span>
                <p className="text-sm font-bold text-[#900C22]">
                  {delegate?.tribal_community || "Not Specified"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                <span className="text-slate-500 font-semibold">Mobile & WhatsApp</span>
                <p className="text-sm font-bold text-slate-900">+91 {delegate?.mobile_number}</p>
                {delegate?.whatsapp_number && (
                  <p className="text-[11px] text-slate-500">WA: +91 {delegate.whatsapp_number}</p>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                <span className="text-slate-500 font-semibold">Email ID</span>
                <p className="text-sm font-bold text-slate-900 truncate">{delegate?.email}</p>
              </div>

              <div className="sm:col-span-2 md:col-span-3 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                <span className="text-slate-500 font-semibold">Residential Address</span>
                <p className="text-sm text-slate-800">{delegate?.full_address}</p>
                <p className="text-xs text-slate-500">
                  {delegate?.city_or_village}, {delegate?.district}, {delegate?.state} - {delegate?.pincode}
                </p>
              </div>

              <div className="sm:col-span-2 md:col-span-3 rounded-xl border border-rose-200 bg-rose-50/70 p-4 space-y-2">
                <span className="text-xs font-bold text-[#900C22] uppercase tracking-wider block">
                  Cultural Attire & Presentation
                </span>
                <p className="text-sm font-semibold text-slate-900">
                  {delegate?.attire_name || "Tribal Heritage Attire"} ({delegate?.attire_representation || "Indigenous Representation"})
                </p>
                {delegate?.attire_description && (
                  <p className="text-xs text-slate-600 italic leading-relaxed">
                    &ldquo;{delegate.attire_description}&rdquo;
                  </p>
                )}
                {delegate?.special_talent && (
                  <div className="pt-2 text-xs text-slate-600">
                    <strong className="text-[#900C22]">Special Talent / Intro:</strong> {delegate.special_talent}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT RECEIPT */}
        {activeTab === "receipt" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6 max-w-2xl mx-auto">
            <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  <span>Payment Receipt</span>
                </h3>
                <p className="text-xs text-slate-500">Official proof of registration payment</p>
              </div>
              <div className="flex items-center gap-2">
                {!isPending && (
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-all cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5 text-[#900C22]" />
                    <span>Download A4 Receipt</span>
                  </button>
                )}
                {isPending ? (
                  <span className="rounded-full bg-amber-100 border border-amber-300 px-3 py-1 text-xs font-bold text-amber-800">
                    PAYMENT PENDING
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                    PAID & VERIFIED
                  </span>
                )}
              </div>
            </div>

            {isPending ? (
              <div className="space-y-4 text-xs text-center py-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 mb-2">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">No Payment Recorded Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  A payment receipt will be generated and stamped here once your ₹500 fee is settled.
                </p>
                <button
                  type="button"
                  onClick={handleResumePayment}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#900C22] hover:bg-[#74091A] text-white px-5 py-2.5 text-xs font-bold shadow-md transition-all mt-2"
                >
                  <span>Pay Now (₹{EVENT_DETAILS.registrationFee})</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-200 text-slate-500">
                  <span>Receipt For:</span>
                  <span className="font-semibold text-slate-900">
                    Dharti Aaba Birsa Jayanti 2026 Ramp Walk Registration
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200 text-slate-500">
                  <span>Registration Number:</span>
                  <span className="font-mono font-bold text-[#900C22]">{delegate?.registration_number}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200 text-slate-500">
                  <span>Participant Name:</span>
                  <span className="font-semibold text-slate-900">{delegate?.full_name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200 text-slate-500">
                  <span>Payment Reference:</span>
                  <span className="font-mono text-slate-700">
                    {delegate?.payment?.razorpay_payment_id || "pay_razorpay_verified"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200 text-slate-500">
                  <span>Payment Date:</span>
                  <span className="text-slate-700">
                    {formatDate(delegate?.confirmed_at || delegate?.created_at)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-4 bg-rose-50 border border-rose-200 rounded-xl px-4 mt-4">
                  <span className="text-sm font-bold text-[#900C22]">Total Amount Paid:</span>
                  <span className="text-2xl font-black text-[#900C22]">
                    {formatCurrency(EVENT_DETAILS.registrationFee)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        </div>

        {/* Dedicated Print-Only Single-Page A4 Registration Slip & Pass */}
        {!isPending && delegate && (
          <div className="hidden print:block w-full">
            <DelegatePrintSlip delegate={delegate} />
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
