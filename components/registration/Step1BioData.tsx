"use client";

import { useMemo } from "react";
import { PROMINENT_TRIBES } from "@/lib/constants/event";
import { calculateAge } from "@/lib/utils";
import { User, Calendar, Users, HeartHandshake } from "lucide-react";

interface Step1Props {
  formData: any;
  updateFormData: (fields: any) => void;
  errors: Record<string, string>;
}

export function Step1BioData({ formData, updateFormData, errors }: Step1Props) {
  const calculatedAge = useMemo(() => {
    if (!formData.dateOfBirth) return null;
    try {
      const age = calculateAge(formData.dateOfBirth);
      return isNaN(age) || age < 0 ? null : age;
    } catch {
      return null;
    }
  }, [formData.dateOfBirth]);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <User className="h-5 w-5 text-amber-400" />
          <span>Section I: Participant Bio-Data</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Please enter your official personal details exactly as they appear on your identity card.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Full Name <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Birsa Samad"
            value={formData.fullName || ""}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
            className={`w-full rounded-xl border bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
              errors.fullName
                ? "border-red-500 focus:ring-red-500/20"
                : "border-slate-800 focus:border-amber-500/50 focus:ring-amber-500/20"
            }`}
          />
          {errors.fullName && <p className="text-xs text-red-400">{errors.fullName}</p>}
        </div>

        {/* Guardian Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Father / Mother / Guardian Name <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Sukhram Samad"
            value={formData.guardianName || ""}
            onChange={(e) => updateFormData({ guardianName: e.target.value })}
            className={`w-full rounded-xl border bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
              errors.guardianName
                ? "border-red-500 focus:ring-red-500/20"
                : "border-slate-800 focus:border-amber-500/50 focus:ring-amber-500/20"
            }`}
          />
          {errors.guardianName && <p className="text-xs text-red-400">{errors.guardianName}</p>}
        </div>

        {/* Date of Birth */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300">
              Date of Birth <span className="text-amber-400">*</span>
            </label>
            {calculatedAge !== null && (
              <span className="text-xs font-medium text-amber-400">
                Calculated Age: {calculatedAge} years
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="date"
              max={new Date().toISOString().split("T")[0]}
              value={formData.dateOfBirth || ""}
              onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
              className={`w-full rounded-xl border bg-slate-900/80 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 transition-all ${
                errors.dateOfBirth
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-slate-800 focus:border-amber-500/50 focus:ring-amber-500/20"
              }`}
            />
          </div>
          {errors.dateOfBirth && <p className="text-xs text-red-400">{errors.dateOfBirth}</p>}
        </div>

        {/* Gender Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Gender <span className="text-amber-400">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "MALE", label: "Male" },
              { id: "FEMALE", label: "Female" },
              { id: "OTHER", label: "Other" },
            ].map((g) => (
              <button
                type="button"
                key={g.id}
                onClick={() => updateFormData({ gender: g.id })}
                className={`rounded-xl border py-2.5 text-xs font-semibold transition-all ${
                  formData.gender === g.id
                    ? "border-amber-500 bg-amber-500/20 text-amber-300 shadow-sm"
                    : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
          {errors.gender && <p className="text-xs text-red-400">{errors.gender}</p>}
        </div>

        {/* Tribal Community */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300">
            Tribal Community / Tribe <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={formData.tribalCommunity || ""}
              onChange={(e) => updateFormData({ tribalCommunity: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="">Select Tribe / Community</option>
              {PROMINENT_TRIBES.map((tribe) => (
                <option key={tribe} value={tribe}>
                  {tribe}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Or type custom tribe name..."
              value={
                PROMINENT_TRIBES.includes(formData.tribalCommunity)
                  ? ""
                  : formData.tribalCommunity || ""
              }
              onChange={(e) => updateFormData({ tribalCommunity: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
