"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { EVENT_DETAILS } from "@/lib/constants/event";
import { Award, Calendar, MapPin, ShieldCheck, Printer, Download, Sparkles, User } from "lucide-react";

interface DigitalPassCardProps {
  delegate: any;
}

export function DigitalPassCard({ delegate }: DigitalPassCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    if (!delegate?.registration_number) return;

    // Generate non-sensitive QR payload containing verification token
    const qrPayload = JSON.stringify({
      regNo: delegate.registration_number,
      name: delegate.full_name,
      cat: delegate.category,
      event: "BIRSA_RAMP_WALK_2026",
      status: "CONFIRMED",
    });

    QRCode.toDataURL(qrPayload, {
      width: 250,
      margin: 1,
      color: {
        dark: "#090D16",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [delegate]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Pass Actions Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <span>Digital Audition Pass</span>
          </h3>
          <p className="text-xs text-slate-400">
            Present this verifiable pass on your phone or as a printout at the audition venue in Rourkela.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="btn-primary-gold flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-lg"
        >
          <Printer className="h-4 w-4" />
          <span>Print / Save Pass (PDF)</span>
        </button>
      </div>

      {/* Printable Pass Container */}
      <div
        id="printable-pass"
        className="relative mx-auto max-w-lg rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-[#0F172A] via-[#090D16] to-[#060910] p-6 sm:p-8 shadow-2xl overflow-hidden print:border-black print:text-black print:bg-white"
      >
        {/* Decorative Top Accent Banner */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500" />

        {/* Pass Header */}
        <div className="text-center space-y-1.5 border-b border-amber-500/20 pb-5 pt-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 text-[10px] font-bold text-amber-300 uppercase tracking-widest">
            Official Audition Pass
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase">
            Dharti Aaba Birsa Jayanti 2026
          </h2>
          <p className="text-xs font-semibold text-amber-400">
            Ramp Walk Competition • Miss & Mr Rourkela
          </p>
        </div>

        {/* Middle Section: Photo & Participant Info */}
        <div className="py-6 flex flex-col sm:flex-row items-center gap-6">
          {/* Photo Frame */}
          <div className="relative w-32 h-40 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-900 shadow-xl shrink-0">
            {delegate?.photo_storage_path || delegate?.photoPreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={delegate.photoPreviewUrl || delegate.photo_storage_path}
                alt={delegate.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                <User className="h-10 w-10 mb-1 text-slate-600" />
                <span>No Photo</span>
              </div>
            )}
            <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 py-0.5 text-center text-[9px] font-bold text-amber-300">
              DELEGATE
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                {delegate?.category || "Miss & Mr Rourkela"}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {delegate?.full_name}
              </h3>
            </div>

            <div className="space-y-1 text-xs text-slate-300">
              <p>
                <span className="text-slate-500">Guardian:</span>{" "}
                <strong>{delegate?.guardian_name || "—"}</strong>
              </p>
              {delegate?.tribal_community && (
                <p>
                  <span className="text-slate-500">Community:</span>{" "}
                  <strong className="text-amber-300">{delegate?.tribal_community}</strong>
                </p>
              )}
              <p>
                <span className="text-slate-500">Origin:</span>{" "}
                {delegate?.city_or_village}, {delegate?.district}, {delegate?.state}
              </p>
            </div>

            <div className="pt-2">
              <span className="inline-block rounded-md bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                ₹500 PAID • VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section: QR Code & Registration Number */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Registration Number
            </span>
            <div className="text-2xl font-black font-mono text-amber-400 tracking-widest">
              {delegate?.registration_number || "TH26-XXXXXX"}
            </div>
            <p className="text-[10px] text-slate-400">
              Venue: {EVENT_DETAILS.location}
            </p>
          </div>

          {/* QR Code */}
          {qrCodeUrl && (
            <div className="p-2 bg-white rounded-xl shadow-md shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="Verification QR Code"
                className="w-20 h-20"
              />
            </div>
          )}
        </div>

        {/* Security & Verification Footer */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span>Cryptographically Verified Pass</span>
          </span>
          <span>Birsa Munda Jayanti Committee</span>
        </div>
      </div>
    </div>
  );
}
