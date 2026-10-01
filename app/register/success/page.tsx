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
  Award,
  ArrowRight,
  Printer,
  Calendar,
  MapPin,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("id");
  const registrationNumber = searchParams.get("reg") || "TH26-CONFIRMED";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-3xl border border-amber-500/30 bg-[#0C1220]/90 p-6 sm:p-10 backdrop-blur-xl shadow-2xl text-center space-y-8">
        
        {/* Success Icon & Badge */}
        <div className="space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>PAYMENT VERIFIED & CONFIRMED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Registration Successful!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Congratulations! You are officially registered as a participant for the{" "}
            <strong className="text-amber-400">Dharti Aaba Birsa Jayanti 2026 Ramp Walk Competition</strong>.
          </p>
        </div>

        {/* Highlighted Registration Number Card */}
        <div className="rounded-2xl border-2 border-dashed border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent p-6 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
            Your Official Registration Number
          </span>
          <div className="text-3xl sm:text-4xl font-black font-mono tracking-wider text-white">
            {registrationNumber}
          </div>
          <p className="text-[11px] text-slate-400">
            Please save or screenshot this number. You will use it along with your mobile number to access your Delegate Pass.
          </p>
        </div>

        {/* Event Schedule & Receipt Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-left text-xs space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="text-slate-400">Registration Fee:</span>
            <span className="font-bold text-emerald-400">₹{EVENT_DETAILS.registrationFee} (PAID)</span>
          </div>
          <div className="flex items-start gap-2.5 text-slate-300">
            <Calendar className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Audition Schedule:</span>{" "}
              {EVENT_DETAILS.dates.audition} • Grand Finale: {EVENT_DETAILS.dates.grandFinale}
            </div>
          </div>
          <div className="flex items-start gap-2.5 text-slate-300">
            <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Venue:</span> {EVENT_DETAILS.location}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Link
            href="/delegate/login"
            className="btn-primary-gold w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold shadow-xl"
          >
            <UserCheck className="h-4 w-4" />
            <span>Go to Delegate Dashboard & Download Pass</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 py-3 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Printer className="h-4 w-4" />
            <span>Print Confirmation Receipt</span>
          </button>
        </div>

        <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Delegate Record Activated • Official Audition Pass Issued</span>
        </div>
      </div>
    </div>
  );
}

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading Confirmation...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
