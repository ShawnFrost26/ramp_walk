"use client";

import { COMPETITION_CATEGORIES, AGE_CATEGORIES } from "@/lib/constants/event";
import { Award } from "lucide-react";

interface Step3Props {
  formData: any;
  updateFormData: (fields: any) => void;
  errors: Record<string, string>;
}

export function Step3Competition({ formData, updateFormData, errors }: Step3Props) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Award className="h-5 w-5 text-[#900C22]" />
          <span>Section III: Competition & Traditional Attire</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Tell us about the category you are participating in and the cultural attire you plan to showcase on the ramp.
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

        {/* Age Category */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Age Category <span className="text-slate-400 font-normal">(Optional / Recommended)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {AGE_CATEGORIES.map((age) => (
              <button
                type="button"
                key={age.id}
                onClick={() => updateFormData({ ageCategory: age.label })}
                className={`rounded-xl border py-2.5 px-3 text-xs font-semibold text-center transition-all ${
                  formData.ageCategory === age.label
                    ? "border-[#900C22] bg-[#900C22] text-white shadow-sm"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                }`}
              >
                {age.label}
              </button>
            ))}
          </div>
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
