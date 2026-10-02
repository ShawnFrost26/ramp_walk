"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { EVENT_DETAILS } from "@/lib/constants/event";
import { ShieldCheck, Printer, Sparkles, User, RefreshCw } from "lucide-react";

interface DigitalPassCardProps {
  delegate: any;
}

export function DigitalPassCard({ delegate }: DigitalPassCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const photoSrc = delegate?.photo_url || delegate?.photoPreviewUrl || delegate?.photo_storage_path;

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
        dark: "#900C22",
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#900C22]" />
            <span>Digital Audition Pass</span>
          </h3>
          <p className="text-xs text-slate-500">
            Present this verifiable pass on your phone or as a printout at the audition venue in Rourkela.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold bg-[#900C22] hover:bg-[#74091A] text-white shadow-md transition-all cursor-pointer"
        >
          <Printer className="h-4 w-4" />
          <span>Print / Save Pass (PDF)</span>
        </button>
      </div>

      {/* Printable Pass Container */}
      <div
        id="printable-pass"
        className="relative mx-auto max-w-lg rounded-3xl border-2 border-[#900C22] bg-white p-6 sm:p-8 shadow-xl overflow-hidden print:border-black print:text-black print:bg-white"
      >
        {/* Decorative Top Accent Banner */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#900C22] via-[#B81D39] to-[#A26715]" />

        {/* Pass Header */}
        <div className="text-center space-y-1.5 border-b border-rose-100 pb-5 pt-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FCECEF] border border-[#F8B4C0] px-3 py-0.5 text-[10px] font-bold text-[#900C22] uppercase tracking-widest">
            Official Audition Pass
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#900C22] tracking-tight uppercase">
            Dharti Aaba Birsa Jayanti 2026
          </h2>
          <p className="text-xs font-semibold text-[#A26715]">
            Ramp Walk Competition • Miss & Mr Rourkela
          </p>
        </div>

        {/* Middle Section: Photo & Participant Info */}
        <div className="py-6 flex flex-col sm:flex-row items-center gap-6">
          {/* Photo Frame with loading and fallback error handling */}
          <div className="relative w-32 h-40 rounded-2xl overflow-hidden border-2 border-[#900C22] bg-slate-100 shadow-md shrink-0">
            {photoSrc && !imageError ? (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 text-slate-400 animate-spin" />
                  </div>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoSrc}
                  alt={delegate.full_name}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 text-xs p-2 text-center">
                <User className="h-10 w-10 mb-1 text-slate-400" />
                <span className="text-[11px] font-medium text-slate-500">Delegate</span>
              </div>
            )}
            <div className="absolute bottom-0 inset-x-0 bg-[#900C22] py-0.5 text-center text-[9px] font-bold text-white tracking-widest">
              DELEGATE
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#900C22] uppercase tracking-wider block">
                {delegate?.category || "Miss & Mr Rourkela"}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {delegate?.full_name}
              </h3>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <p>
                <span className="text-slate-400">Guardian:</span>{" "}
                <strong className="text-slate-700">{delegate?.guardian_name || "—"}</strong>
              </p>
              {delegate?.tribal_community && (
                <p>
                  <span className="text-slate-400">Community:</span>{" "}
                  <strong className="text-[#900C22]">{delegate?.tribal_community}</strong>
                </p>
              )}
              <p>
                <span className="text-slate-400">Origin:</span>{" "}
                {delegate?.city_or_village}, {delegate?.district}, {delegate?.state}
              </p>
            </div>

            <div className="pt-2">
              <span className="inline-block rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                ₹{EVENT_DETAILS.registrationFee} PAID • VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section: QR Code & Registration Number */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Registration Number
            </span>
            <div className="text-2xl font-black font-mono text-[#900C22] tracking-widest">
              {delegate?.registration_number || "TH2026-XXXX"}
            </div>
            <p className="text-[10px] text-slate-500">
              Venue: {EVENT_DETAILS.location}
            </p>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center shrink-0">
            {qrCodeUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCodeUrl}
                alt="Digital Pass QR Code"
                className="w-24 h-24 rounded-xl border border-slate-300 bg-white p-1 shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-xs text-slate-400">
                Loading QR...
              </div>
            )}
            <span className="text-[9px] font-mono text-slate-400 mt-1">SCAN AT ENTRY GATE</span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-slate-200 text-center">
          <p className="text-[10px] text-slate-400">
            Issued by {EVENT_DETAILS.organizer} • Birsa Munda Jayanti 2026
          </p>
        </div>
      </div>
    </div>
  );
}
