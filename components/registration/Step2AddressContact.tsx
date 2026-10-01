"use client";

import { IDENTITY_PROOF_TYPES } from "@/lib/constants/event";
import { MapPin, Mail } from "lucide-react";

interface Step2Props {
  formData: any;
  updateFormData: (fields: any) => void;
  errors: Record<string, string>;
}

export function Step2AddressContact({ formData, updateFormData, errors }: Step2Props) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <MapPin className="h-5 w-5 text-amber-400" />
          <span>Section II: Contact, Address & Identity</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Your mobile number and email will be used for your Delegate login, audition alerts, and pass issuance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Mobile Number */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Primary Mobile Number <span className="text-amber-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">+91</span>
            <input
              type="tel"
              maxLength={10}
              placeholder="9876543210"
              value={formData.mobileNumber || ""}
              onChange={(e) => updateFormData({ mobileNumber: e.target.value.replace(/\D/g, "") })}
              className={`w-full rounded-xl border bg-slate-900/80 pl-12 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.mobileNumber
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-slate-800 focus:border-amber-500/50 focus:ring-amber-500/20"
              }`}
            />
          </div>
          {errors.mobileNumber && <p className="text-xs text-red-400">{errors.mobileNumber}</p>}
        </div>

        {/* WhatsApp Number */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            WhatsApp Number <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">+91</span>
            <input
              type="tel"
              maxLength={10}
              placeholder="Leave blank if same as mobile"
              value={formData.whatsappNumber || ""}
              onChange={(e) => updateFormData({ whatsappNumber: e.target.value.replace(/\D/g, "") })}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-12 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
          {errors.whatsappNumber && <p className="text-xs text-red-400">{errors.whatsappNumber}</p>}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300">
            Email ID <span className="text-amber-400">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="email"
              placeholder="e.g. birsa.participant@gmail.com"
              value={formData.email || ""}
              onChange={(e) => updateFormData({ email: e.target.value.toLowerCase() })}
              className={`w-full rounded-xl border bg-slate-900/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-slate-800 focus:border-amber-500/50 focus:ring-amber-500/20"
              }`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
        </div>

        {/* State */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            State <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Odisha, Jharkhand, etc."
            value={formData.state || ""}
            onChange={(e) => updateFormData({ state: e.target.value })}
            className={`w-full rounded-xl border bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
              errors.state
                ? "border-red-500 focus:ring-red-500/20"
                : "border-slate-800 focus:border-amber-500/50 focus:ring-amber-500/20"
            }`}
          />
          {errors.state && <p className="text-xs text-red-400">{errors.state}</p>}
        </div>

        {/* District */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            District <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Sundargarh"
            value={formData.district || ""}
            onChange={(e) => updateFormData({ district: e.target.value })}
            className={`w-full rounded-xl border bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
              errors.district
                ? "border-red-500 focus:ring-red-500/20"
                : "border-slate-800 focus:border-amber-500/50 focus:ring-amber-500/20"
            }`}
          />
          {errors.district && <p className="text-xs text-red-400">{errors.district}</p>}
        </div>

        {/* City or Village */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Village / Town / City <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Rourkela, Panposh, etc."
            value={formData.cityOrVillage || ""}
            onChange={(e) => updateFormData({ cityOrVillage: e.target.value })}
            className={`w-full rounded-xl border bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
              errors.cityOrVillage
                ? "border-red-500 focus:ring-red-500/20"
                : "border-slate-800 focus:border-amber-500/50 focus:ring-amber-500/20"
            }`}
          />
          {errors.cityOrVillage && <p className="text-xs text-red-400">{errors.cityOrVillage}</p>}
        </div>

        {/* PIN Code */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            PIN Code <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            maxLength={6}
            placeholder="769001"
            value={formData.pincode || ""}
            onChange={(e) => updateFormData({ pincode: e.target.value.replace(/\D/g, "") })}
            className={`w-full rounded-xl border bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
              errors.pincode
                ? "border-red-500 focus:ring-red-500/20"
                : "border-slate-800 focus:border-amber-500/50 focus:ring-amber-500/20"
            }`}
          />
          {errors.pincode && <p className="text-xs text-red-400">{errors.pincode}</p>}
        </div>

        {/* Full Address */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300">
            Full Residential Address <span className="text-amber-400">*</span>
          </label>
          <textarea
            rows={2}
            placeholder="House / Street / Colony, Post Office..."
            value={formData.fullAddress || ""}
            onChange={(e) => updateFormData({ fullAddress: e.target.value })}
            className={`w-full rounded-xl border bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
              errors.fullAddress
                ? "border-red-500 focus:ring-red-500/20"
                : "border-slate-800 focus:border-amber-500/50 focus:ring-amber-500/20"
            }`}
          />
          {errors.fullAddress && <p className="text-xs text-red-400">{errors.fullAddress}</p>}
        </div>

        {/* Optional: Identity Proof */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Identity Proof Type <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <select
            value={formData.identityProofType || ""}
            onChange={(e) => updateFormData({ identityProofType: e.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
          >
            <option value="">Select ID Type</option>
            {IDENTITY_PROOF_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            ID Document Number <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. XXXX-XXXX-XXXX"
            value={formData.identityProofNumber || ""}
            onChange={(e) => updateFormData({ identityProofNumber: e.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        {/* Education & Occupation */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Educational Qualification <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Graduation / 12th Pass / Student"
            value={formData.educationalQualification || ""}
            onChange={(e) => updateFormData({ educationalQualification: e.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Instagram Handle <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">@</span>
            <input
              type="text"
              placeholder="your_handle"
              value={formData.instagramHandle || ""}
              onChange={(e) => updateFormData({ instagramHandle: e.target.value.replace(/^@/, "") })}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-8 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
