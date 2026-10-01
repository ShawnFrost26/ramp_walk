"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { EVENT_DETAILS } from "@/lib/constants/event";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Printer,
  Calendar,
  MapPin,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const registrationNumber = searchParams.get("reg") || "TH26-CONFIRMED";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl text-center space-y-8">
        
        {/* Success Icon & Badge */}
        <div className="space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            <span>PAYMENT VERIFIED & CONFIRMED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Registration Successful!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Congratulations! You are officially registered as a participant for the{" "}
            <strong className="text-[#900C22]">Dharti Aaba Birsa Jayanti 2026 Ramp Walk Competition</strong>.
          </p>
        </div>

        {/* Highlighted Registration Number Card */}
        <div className="rounded-2xl border-2 border-dashed border-[#900C22]/40 bg-rose-50/70 p-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#900C22]">
            Your Official Registration Number
          </span>
          <div className="text-3xl sm:text-4xl font-black font-mono tracking-wider text-[#900C22]">
            {registrationNumber}
          </div>
          <p className="text-[11px] text-slate-500">
            Please save or screenshot this number. You will use it along with your mobile number to access your Delegate Pass.
          </p>
        </div>

        {/* Event Schedule & Receipt Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-left text-xs space-y-3">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <span className="text-slate-500">Registration Fee:</span>
            <span className="font-bold text-emerald-700">₹{EVENT_DETAILS.registrationFee} (PAID)</span>
          </div>
          <div className="flex items-start gap-2.5 text-slate-700">
            <Calendar className="h-4 w-4 text-[#900C22] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Audition Schedule:</span>{" "}
              {EVENT_DETAILS.dates.audition} • Grand Finale: {EVENT_DETAILS.dates.grandFinale}
            </div>
          </div>
          <div className="flex items-start gap-2.5 text-slate-700">
            <MapPin className="h-4 w-4 text-[#900C22] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Venue:</span> {EVENT_DETAILS.location}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Link
            href="/delegate/login"
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold bg-[#900C22] hover:bg-[#74091A] text-white shadow-lg transition-all"
          >
            <UserCheck className="h-4 w-4" />
            <span>Go to Delegate Dashboard & Download Pass</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 py-3 text-xs font-semibold text-slate-700 transition-all"
          >
            <Printer className="h-4 w-4" />
            <span>Print Confirmation Receipt</span>
          </button>
        </div>

        <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Delegate Record Activated • Official Audition Pass Issued</span>
        </div>
      </div>
    </div>
  );
}

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <Navbar />
      <main className="flex-1 bg-grid-pattern">
        <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Confirmation...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
