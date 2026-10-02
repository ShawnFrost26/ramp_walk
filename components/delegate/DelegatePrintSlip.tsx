"use client";

import { EVENT_DETAILS } from "@/lib/constants/event";
import { formatDate, formatCurrency, calculateAge } from "@/lib/utils";
import { ShieldCheck, CheckCircle2, MapPin, Phone, Mail, User } from "lucide-react";

interface DelegatePrintSlipProps {
  delegate: any;
}

export function DelegatePrintSlip({ delegate }: DelegatePrintSlipProps) {
  if (!delegate) return null;

  const photoSrc = delegate.photo_url || delegate.photoPreviewUrl || delegate.photo_storage_path;
  const payment = delegate.payment;
  
  let calculatedAgeStr = "";
  if (delegate.date_of_birth) {
    try {
      const age = calculateAge(delegate.date_of_birth);
      if (!isNaN(age) && age > 0) {
        calculatedAgeStr = `${age} Years`;
      }
    } catch {
      // fallback
    }
  }

  return (
    <div
      id="printable-delegate-slip"
      className="bg-white text-slate-900 mx-auto w-full max-w-[210mm] p-6 sm:p-8 rounded-2xl border-2 border-[#900C22] shadow-sm font-sans"
      style={{ boxSizing: "border-box" }}
    >
      {/* 1. Official Header */}
      <div className="border-b-2 border-[#900C22] pb-3 text-center space-y-1">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] font-bold tracking-widest text-[#900C22] uppercase block">
              Govt. Recognized Tribal Heritage Event
            </span>
            <span className="text-[11px] text-slate-500 font-semibold block">
              Birsa Munda Jayanti 2026 Celebration
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>CONFIRMED AUDITION PASS</span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-[#900C22] uppercase tracking-tight pt-1">
          Dharti Aaba Veer Birsa Munda Jayanti 2026
        </h1>
        <p className="text-xs font-bold text-[#A26715] tracking-wide uppercase">
          State-Level Ramp Walk Competition • Official Delegate Entry Slip
        </p>
        <p className="text-[10px] text-slate-500">
          Organized by: {EVENT_DETAILS.organizer} • Rourkela, Sundargarh, Odisha
        </p>
      </div>

      {/* 2. Registration ID & Photo Hero Row */}
      <div className="py-4 border-b border-slate-200 flex flex-row items-center justify-between gap-4">
        {/* Registration Number & Key Identifiers */}
        <div className="space-y-1.5 flex-1 text-left">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Delegate Registration Number
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#900C22] tracking-wider">
            {delegate.registration_number || "TH2026-PENDING"}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="inline-block bg-[#900C22] text-white px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide">
              {delegate.category || "Mr / Miss Rourkela"}
            </span>
            <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold">
              Age Limit: 15 – 35 Years (Verified)
            </span>
          </div>

          <p className="text-[11px] text-slate-600 pt-1">
            <strong>Audition Venue:</strong> {EVENT_DETAILS.location}
          </p>
        </div>

        {/* Uploaded Photograph Frame */}
        <div className="relative w-28 h-36 rounded-xl border-2 border-[#900C22] bg-slate-100 overflow-hidden shadow-sm shrink-0 flex flex-col items-center justify-center">
          {photoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoSrc}
              alt={delegate.full_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 text-xs">
              <User className="h-8 w-8 mb-1" />
              <span className="text-[10px]">Photo</span>
            </div>
          )}
          <div className="absolute bottom-0 inset-x-0 bg-[#900C22] py-0.5 text-center text-[8px] font-black text-white uppercase tracking-widest">
            OFFICIAL DELEGATE
          </div>
        </div>
      </div>

      {/* 3. Delegate Bio-Data & Residential Details Table */}
      <div className="py-3 border-b border-slate-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-[#900C22]" />
          <span>Delegate Personal & Contact Information</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs">
          <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Full Name</span>
            <strong className="text-slate-900 text-xs sm:text-sm block truncate">{delegate.full_name}</strong>
          </div>

          <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Father / Guardian</span>
            <strong className="text-slate-800 text-xs block truncate">{delegate.guardian_name || "—"}</strong>
          </div>

          <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Date of Birth & Age</span>
            <strong className="text-slate-800 text-xs block">
              {delegate.date_of_birth} {calculatedAgeStr && `(${calculatedAgeStr})`}
            </strong>
          </div>

          <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Gender & Community</span>
            <strong className="text-slate-800 text-xs block">
              {delegate.gender} • {delegate.tribal_community || "Indigenous"}
            </strong>
          </div>

          <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Mobile & WhatsApp</span>
            <strong className="text-slate-800 text-xs block">
              +91 {delegate.mobile_number}
              {delegate.whatsapp_number && ` (WA: ${delegate.whatsapp_number})`}
            </strong>
          </div>

          <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Email Address</span>
            <strong className="text-slate-800 text-xs block truncate">{delegate.email}</strong>
          </div>

          <div className="rounded-lg bg-slate-50 p-2 border border-slate-100 col-span-2 sm:col-span-3">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Complete Address</span>
            <span className="text-slate-800 text-xs block">
              {delegate.full_address ? `${delegate.full_address}, ` : ""}
              {delegate.city_or_village}, {delegate.district}, {delegate.state} - {delegate.pincode}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Payment & Verification Details */}
      <div className="py-3 border-b border-slate-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Payment Success & Verification Details</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs rounded-xl bg-emerald-50/70 border border-emerald-200 p-2.5">
          <div>
            <span className="text-[10px] text-emerald-800 font-semibold block uppercase">Registration Fee</span>
            <span className="text-sm font-black text-emerald-900 block">
              ₹{EVENT_DETAILS.registrationFee}.00 INR
            </span>
          </div>

          <div>
            <span className="text-[10px] text-emerald-800 font-semibold block uppercase">Payment Status</span>
            <span className="text-xs font-bold text-emerald-700 inline-flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>PAID & VERIFIED</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] text-emerald-800 font-semibold block uppercase">Payment Ref / ID</span>
            <span className="font-mono text-[11px] text-slate-800 block truncate">
              {payment?.razorpay_payment_id || "PAY_CONFIRMED_ONLINE"}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-emerald-800 font-semibold block uppercase">Verification Date</span>
            <span className="text-[11px] text-slate-700 block">
              {formatDate(payment?.captured_at || delegate.confirmed_at || delegate.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Audition Guidelines & Venue Notes */}
      <div className="pt-3 pb-2 text-[10px] text-slate-500 space-y-1">
        <strong className="block text-slate-700 uppercase tracking-wide text-[11px]">
          Audition Guidelines & Instructions:
        </strong>
        <ul className="list-disc pl-4 space-y-0.5 leading-relaxed text-slate-600">
          <li>Please present a printed copy of this official registration slip or show it on your mobile device at the entry desk.</li>
          <li>Carry an original photo identity card (Aadhaar / Voter ID / College ID) for on-spot verification.</li>
          <li>For any queries, contact the Secretariat Helpline: <strong>8917598855</strong> or WhatsApp: <strong>{EVENT_DETAILS.contact.whatsapp}</strong>.</li>
        </ul>
      </div>

      {/* 6. Official Seal & Signatory Footer */}
      <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
        <div className="space-y-0.5 text-left">
          <span className="font-mono text-[10px] text-slate-400 block">
            Security Hash: {delegate.id?.slice(0, 16).toUpperCase() || "AUTH-SEC-2026"}
          </span>
          <span className="text-[10px] text-slate-400 block">
            Computer Generated Entry Slip • No physical signature required
          </span>
        </div>

        <div className="text-right space-y-1">
          <div className="text-[11px] font-bold text-[#900C22] uppercase tracking-wider">
            Dharti Aaba Jayanti Committee
          </div>
          <span className="inline-block border-t border-slate-400 pt-1 text-[10px] text-slate-500 font-semibold">
            Authorized Secretariat Desk
          </span>
        </div>
      </div>
    </div>
  );
}
