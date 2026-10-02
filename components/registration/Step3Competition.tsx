"use client";

import { useMemo } from "react";
import { COMPETITION_CATEGORIES, AGE_LIMIT_CRITERIA } from "@/lib/constants/event";
import { calculateAge } from "@/lib/utils";
import { Award, CheckCircle2, AlertCircle, Lock, ShieldCheck } from "lucide-react";

interface Step3Props {
  formData: any;
  updateFormData: (fields: any) => void;
  errors: Record<string, string>;
}

export function Step3Competition({ formData, updateFormData, errors }: Step3Props) {
  // Dynamically calculate age from Date of Birth entered in Section I
  const calculatedAge = useMemo(() => {
    if (!formData.dateOfBirth) return null;
    try {
      const age = calculateAge(formData.dateOfBirth);
      return isNaN(age) || age < 0 ? null : age;
    } catch {
      return null;
    }
  }, [formData.dateOfBirth]);

  const hasDob = calculatedAge !== null;
  const isAgeEligible = hasDob && calculatedAge >= 15 && calculatedAge <= 35;
  const isConfirmed = Boolean(formData.ageEligibilityConfirmed);

  const handleToggleAgeConfirmation = () => {
    if (!isAgeEligible) return; // Non-clickable if not eligible
    const nextState = !isConfirmed;
    updateFormData({
      ageEligibilityConfirmed: nextState,
      ageCategory: "15 – 35 Years",
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Award className="h-5 w-5 text-[#900C22]" />
          <span>Section III: Competition & Traditional Attire</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Select your ramp walk category, verify your 15–35 years age eligibility, and provide details of the indigenous attire you plan to showcase.
        </p>
      </div>

      <div className="space-y-6">
        {/* Category Selection Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Competition Category <span className="text-[#900C22]">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMPETITION_CATEGORIES.map((cat) => {
              const isSelected = formData.category === cat.title;
              return (
                <div
                  key={cat.id}
                  onClick={() => updateFormData({ category: cat.title })}
                  className={`cursor-pointer rounded-xl border p-4 transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-[#900C22] bg-[#FFF5F6] text-slate-900 ring-2 ring-[#900C22]/20 shadow-md"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">{cat.title}</span>
                      {isSelected && (
                        <span className="rounded-full bg-[#900C22] px-2 py-0.5 text-[10px] font-bold text-white">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{cat.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
        </div>

        {/* Mandatory Age Limit (15–35 Years) Selection / Confirmation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700">
              Age Limit & Participant Eligibility <span className="text-[#900C22]">* (Mandatory)</span>
            </label>
            {hasDob && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  isAgeEligible
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                DOB Age: {calculatedAge} Years
              </span>
            )}
          </div>

          {/* If DOB is not provided yet */}
          {!hasDob && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Date of Birth Required</strong>
                <span>
                  Please return to <strong>Section I (Participant Bio-Data)</strong> and fill in your Date of Birth. Once entered, this 15–35 years age verification will become active.
                </span>
              </div>
            </div>
          )}

          {/* If DOB is provided, show the Age Limit interactive box */}
          {hasDob && (
            <div>
              <div
                onClick={isAgeEligible ? handleToggleAgeConfirmation : undefined}
                className={`rounded-xl border p-4 transition-all select-none ${
                  !isAgeEligible
                    ? "cursor-not-allowed opacity-70 border-red-200 bg-red-50/50"
                    : isConfirmed
                    ? "cursor-pointer border-[#900C22] bg-[#900C22] text-white shadow-md ring-2 ring-[#900C22]/30"
                    : "cursor-pointer border-slate-300 bg-white text-slate-800 hover:border-[#900C22] hover:bg-rose-50/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border shrink-0 transition-colors ${
                        !isAgeEligible
                          ? "bg-red-100 text-red-600 border-red-200"
                          : isConfirmed
                          ? "bg-white text-[#900C22] border-white"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {!isAgeEligible ? (
                        <Lock className="h-4 w-4" />
                      ) : isConfirmed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <ShieldCheck className="h-5 w-5" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold ${
                            isConfirmed && isAgeEligible ? "text-white" : "text-slate-900"
                          }`}
                        >
                          Age Limit: 15 – 35 Years (Eligible Participant)
                        </span>
                        {isConfirmed && isAgeEligible && (
                          <span className="rounded-full bg-white text-[#900C22] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide">
                            Confirmed ✓
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-xs ${
                          isConfirmed && isAgeEligible ? "text-rose-100" : "text-slate-500"
                        }`}
                      >
                        {isAgeEligible
                          ? isConfirmed
                            ? `You have confirmed age eligibility (Calculated Age: ${calculatedAge} years). Click to toggle if needed.`
                            : `Click here to confirm that your age falls within the mandatory 15–35 years criteria (Calculated Age: ${calculatedAge} years).`
                          : `Participant must be between 15 and 35 years old. Your calculated age is ${calculatedAge} years, which does not meet the eligibility criterion.`}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    {isAgeEligible ? (
                      <div
                        className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                          isConfirmed
                            ? "bg-white text-[#900C22] border-white"
                            : "border-slate-400 bg-white"
                        }`}
                      >
                        {isConfirmed && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-red-600 bg-red-100 border border-red-200 px-2 py-0.5 rounded">
                        Disabled
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!isAgeEligible && (
                <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                  <span>
                    <strong>Ineligible:</strong> This registration is restricted to participants aged 15 to 35 years. The calculated age ({calculatedAge} years) is outside this range.
                  </span>
                </div>
              )}
            </div>
          )}

          {(errors.ageCategory || errors.ageEligibilityConfirmed) && (
            <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>
                {errors.ageCategory || errors.ageEligibilityConfirmed || "Please click and confirm the 15–35 Years Age Eligibility to proceed."}
              </span>
            </p>
          )}
        </div>

        {/* Attire Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          {/* Attire Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Name of Traditional Attire / Dress <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Santhali Panchi Parhat / Tar-Gamcha"
              value={formData.attireName || ""}
              onChange={(e) => updateFormData({ attireName: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#900C22] focus:ring-2 focus:ring-[#900C22]/20"
            />
          </div>

          {/* State / Tribe Represented */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              State / Tribe Represented Through Attire <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Munda (Odisha/Jharkhand)"
              value={formData.attireRepresentation || ""}
              onChange={(e) => updateFormData({ attireRepresentation: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#900C22] focus:ring-2 focus:ring-[#900C22]/20"
            />
          </div>

          {/* Description of Attire & Significance */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700">
              Brief Description of Attire & Cultural Significance <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Describe the fabric weaves, hand embroidery, tribal ornaments, motifs, or historical symbolism behind your dress..."
              value={formData.attireDescription || ""}
              onChange={(e) => updateFormData({ attireDescription: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#900C22] focus:ring-2 focus:ring-[#900C22]/20"
            />
          </div>

          {/* Special Talent / Intro */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700">
              Special Talent / Self Introduction <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Tribal folk dance, singing, archery, poetry, musical instrument, or stage introduction..."
              value={formData.specialTalent || ""}
              onChange={(e) => updateFormData({ specialTalent: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#900C22] focus:ring-2 focus:ring-[#900C22]/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
