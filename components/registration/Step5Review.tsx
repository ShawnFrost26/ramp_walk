"use client";

import { EVENT_DETAILS } from "@/lib/constants/event";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldCheck,
  CheckSquare,
  Square,
  ArrowRight,
  AlertTriangle,
  Camera,
  Lock,
  CheckCircle2,
} from "lucide-react";

interface Step5Props {
  formData: any;
  updateFormData: (fields: any) => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onProceedToPayment: () => void;
  onGoToStep?: (step: number) => void;
}

export function Step5Review({
  formData,
  updateFormData,
  errors,
  isSubmitting,
  onProceedToPayment,
  onGoToStep,
}: Step5Props) {
  const hasPhoto = Boolean(formData.photoStoragePath);
  const isPaymentBlocked = !hasPhoto || isSubmitting;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#900C22]" />
          <span>Section V: Review & Declaration</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Please carefully verify all your registration details before proceeding to the secure Razorpay payment gateway.
        </p>
      </div>

      {/* Mandatory Photo Missing Warning Banner */}
      {!hasPhoto && (
        <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-5 space-y-3 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-900">
                Mandatory Profile Photograph Missing
              </h4>
              <p className="text-xs text-red-700 mt-0.5">
                Every delegate must provide a photograph before advancing to the payment gateway.
                Your digital entry pass and jury card cannot be issued without a photo.
              </p>
            </div>
          </div>
          {onGoToStep && (
            <button
              type="button"
              onClick={() => onGoToStep(4)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 shadow-sm transition-all"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Go to Step 4 to Upload Photograph</span>
            </button>
          )}
        </div>
      )}

      {/* Summary Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {formData.photoPreviewUrl ? (
            <div className="w-24 h-32 rounded-xl overflow-hidden border-2 border-[#900C22] shrink-0 shadow-md bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.photoPreviewUrl}
                alt="Participant"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-32 rounded-xl border-2 border-dashed border-red-300 bg-red-50/50 flex flex-col items-center justify-center text-center p-2 text-xs text-red-600 shrink-0">
              <Camera className="h-6 w-6 text-red-400 mb-1" />
              <span className="font-semibold text-[11px]">Photo Missing</span>
              <span className="text-[9px] text-red-500 font-bold uppercase">(Required)</span>
            </div>
          )}

          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase font-bold text-[#900C22] bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                {formData.category}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                <span>15 – 35 Years (Eligible)</span>
              </span>
            </div>
            <h4 className="text-xl font-bold text-slate-900">{formData.fullName || "—"}</h4>
            <p className="text-xs text-slate-600">
              Guardian: <strong>{formData.guardianName || "—"}</strong>
            </p>
            <p className="text-xs text-slate-500">
              DOB: {formData.dateOfBirth || "—"} • Gender: {formData.gender || "—"}
            </p>
            {formData.tribalCommunity && (
              <p className="text-xs text-[#900C22] font-semibold">
                Tribe/Community: {formData.tribalCommunity}
              </p>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Contact Details:</span>
            <div className="text-slate-700 mt-0.5">
              Phone: {formData.mobileNumber}
              {formData.whatsappNumber && ` (WA: ${formData.whatsappNumber})`}
            </div>
            <div className="text-slate-700">Email: {formData.email}</div>
            {formData.instagramHandle && (
              <div className="text-[#900C22] font-medium">IG: @{formData.instagramHandle}</div>
            )}
          </div>

          <div>
            <span className="text-slate-400 font-medium">Address:</span>
            <div className="text-slate-700 mt-0.5">
              {formData.cityOrVillage}, {formData.district}, {formData.state} - {formData.pincode}
            </div>
            <div className="text-slate-500 truncate">{formData.fullAddress}</div>
          </div>

          {(formData.attireName || formData.attireRepresentation) && (
            <div className="sm:col-span-2 border-t border-slate-100 pt-3">
              <span className="text-slate-400 font-medium">Traditional Attire Presentation:</span>
              <div className="text-slate-700 mt-0.5 font-medium">
                {formData.attireName} ({formData.attireRepresentation})
              </div>
              {formData.attireDescription && (
                <div className="text-slate-500 text-[11px] mt-1 italic">
                  &ldquo;{formData.attireDescription}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Payment Summary Box */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase text-[#900C22]">Registration Fee</span>
            <p className="text-xs text-slate-600">Miss & Mr Rourkela 2026 Ramp Walk Audition</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-[#900C22]">
              {formatCurrency(EVENT_DETAILS.registrationFee)}
            </div>
            <span className="text-[10px] text-slate-500">Fixed server-verified fee</span>
          </div>
        </div>
      </div>

      {/* Consent & Declarations */}
      <div className="space-y-3 pt-2">
        <div
          onClick={() => updateFormData({ termsAccepted: !formData.termsAccepted })}
          className="flex items-start gap-3 cursor-pointer group"
        >
          <div className="mt-0.5 shrink-0 text-[#900C22]">
            {formData.termsAccepted ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
            )}
          </div>
          <span className="text-xs text-slate-600 select-none leading-relaxed">
            I confirm that the information provided is correct, and I agree to the{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[#900C22] underline font-semibold hover:text-[#74091A]"
            >
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a
              href="/refund-policy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[#900C22] underline font-semibold hover:text-[#74091A]"
            >
              Cancellation & Refund Policy
            </a>
            .
          </span>
        </div>
        {errors.termsAccepted && <p className="text-xs text-red-500">{errors.termsAccepted}</p>}

        <div
          onClick={() => updateFormData({ privacyAccepted: !formData.privacyAccepted })}
          className="flex items-start gap-3 cursor-pointer group"
        >
          <div className="mt-0.5 shrink-0 text-[#900C22]">
            {formData.privacyAccepted ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
            )}
          </div>
          <span className="text-xs text-slate-600 select-none leading-relaxed">
            I agree to the{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[#900C22] underline font-semibold hover:text-[#74091A]"
            >
              Privacy Policy
            </a>{" "}
            and authorize the organizers to use my photograph and audition video for event promotion, broadcast, and delegate identification.
          </span>
        </div>
        {errors.privacyAccepted && <p className="text-xs text-red-500">{errors.privacyAccepted}</p>}
      </div>

      {/* Action Button */}
      <div className="pt-4 space-y-2">
        <button
          type="button"
          disabled={isPaymentBlocked}
          onClick={onProceedToPayment}
          className={`w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-base font-bold shadow-lg transition-all ${
            isPaymentBlocked
              ? "bg-slate-300 text-slate-500 cursor-not-allowed opacity-75 shadow-none"
              : "bg-[#900C22] hover:bg-[#74091A] text-white cursor-pointer"
          }`}
        >
          {isPaymentBlocked && !hasPhoto ? (
            <>
              <Lock className="h-5 w-5" />
              <span>Upload Photo in Section IV to Enable Payment</span>
            </>
          ) : (
            <>
              <span>
                {isSubmitting ? "Initiating Secure Checkout..." : `Proceed to Payment (${formatCurrency(EVENT_DETAILS.registrationFee)})`}
              </span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>

        {!hasPhoto && (
          <p className="text-center text-xs text-red-500 font-medium">
            ⚠️ The Payment step is locked because the participant photograph has not been uploaded.
          </p>
        )}
      </div>
    </div>
  );
}
