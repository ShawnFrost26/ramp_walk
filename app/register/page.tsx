"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { StepIndicator } from "@/components/registration/StepIndicator";
import { Step1BioData } from "@/components/registration/Step1BioData";
import { Step2AddressContact } from "@/components/registration/Step2AddressContact";
import { Step3Competition } from "@/components/registration/Step3Competition";
import { Step4Photo } from "@/components/registration/Step4Photo";
import { Step5Review } from "@/components/registration/Step5Review";
import {
  step1BioDataSchema,
  step2AddressContactSchema,
  step3CompetitionSchema,
  step5ReviewConsentSchema,
} from "@/lib/validations/registration";
import { EVENT_DETAILS, COMPETITION_CATEGORIES } from "@/lib/constants/event";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";

const STEPS = [
  { title: "Bio-Data", description: "Personal details" },
  { title: "Contact", description: "Address & phone" },
  { title: "Attire", description: "Competition details" },
  { title: "Photo", description: "1 MB Portrait" },
  { title: "Review", description: "Confirm & Pay" },
];

function RegistrationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCategory = searchParams.get("category");

  // Initial Category fallback
  const matchedCategory = COMPETITION_CATEGORIES.find((c) => c.id === preselectedCategory);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    fullName: "",
    guardianName: "",
    dateOfBirth: "",
    gender: "MALE",
    tribalCommunity: "",

    identityProofType: "",
    identityProofNumber: "",
    state: "Odisha",
    district: "Sundargarh",
    cityOrVillage: "",
    fullAddress: "",
    pincode: "",
    mobileNumber: "",
    whatsappNumber: "",
    email: "",
    educationalQualification: "",
    occupation: "",
    instagramHandle: "",

    category: matchedCategory?.title || COMPETITION_CATEGORIES[0].title,
    ageCategory: "Youth / Main (18 – 28 Years)",
    attireName: "",
    attireRepresentation: "",
    attireDescription: "",
    specialTalent: "",

    photoStoragePath: "",
    photoPreviewUrl: "",

    termsAccepted: false,
    privacyAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const updateFormData = (fields: any) => {
    setFormData((prev: any) => ({ ...prev, ...fields }));
    // Clear relevant errors
    const keys = Object.keys(fields);
    if (keys.length > 0) {
      setErrors((prev) => {
        const next = { ...prev };
        keys.forEach((k) => delete next[k]);
        return next;
      });
    }
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    setErrors({});
    setServerError(null);

    if (currentStep === 1) {
      const res = step1BioDataSchema.safeParse({
        fullName: formData.fullName,
        guardianName: formData.guardianName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        tribalCommunity: formData.tribalCommunity,
      });

      if (!res.success) {
        const fieldErrors = res.error.flatten().fieldErrors;
        const errMap: Record<string, string> = {};
        for (const [key, val] of Object.entries(fieldErrors)) {
          if (val && val[0]) errMap[key] = val[0];
        }
        setErrors(errMap);
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      const res = step2AddressContactSchema.safeParse({
        identityProofType: formData.identityProofType,
        identityProofNumber: formData.identityProofNumber,
        state: formData.state,
        district: formData.district,
        cityOrVillage: formData.cityOrVillage,
        fullAddress: formData.fullAddress,
        pincode: formData.pincode,
        mobileNumber: formData.mobileNumber,
        whatsappNumber: formData.whatsappNumber,
        email: formData.email,
        educationalQualification: formData.educationalQualification,
        occupation: formData.occupation,
        instagramHandle: formData.instagramHandle,
      });

      if (!res.success) {
        const fieldErrors = res.error.flatten().fieldErrors;
        const errMap: Record<string, string> = {};
        for (const [key, val] of Object.entries(fieldErrors)) {
          if (val && val[0]) errMap[key] = val[0];
        }
        setErrors(errMap);
        return false;
      }

      // Check Mobile and Email Uniqueness on server
      try {
        const checkRes = await fetch("/api/registrations/check-availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobileNumber: formData.mobileNumber,
            email: formData.email,
          }),
        });
        const checkData = await checkRes.json();
        if (!checkData.available) {
          setErrors({ [checkData.field]: checkData.message });
          return false;
        }
      } catch (err) {
        console.warn("Availability check bypassed in dev:", err);
      }

      return true;
    }

    if (currentStep === 3) {
      const res = step3CompetitionSchema.safeParse({
        category: formData.category,
        ageCategory: formData.ageCategory,
        attireName: formData.attireName,
        attireRepresentation: formData.attireRepresentation,
        attireDescription: formData.attireDescription,
        specialTalent: formData.specialTalent,
      });

      if (!res.success) {
        const fieldErrors = res.error.flatten().fieldErrors;
        const errMap: Record<string, string> = {};
        for (const [key, val] of Object.entries(fieldErrors)) {
          if (val && val[0]) errMap[key] = val[0];
        }
        setErrors(errMap);
        return false;
      }
      return true;
    }

    if (currentStep === 4) {
      // Photo is recommended. If user has not uploaded one, allow them to proceed or recommend uploading
      return true;
    }

    if (currentStep === 5) {
      const res = step5ReviewConsentSchema.safeParse({
        termsAccepted: formData.termsAccepted,
        privacyAccepted: formData.privacyAccepted,
      });

      if (!res.success) {
        const fieldErrors = res.error.flatten().fieldErrors;
        const errMap: Record<string, string> = {};
        for (const [key, val] of Object.entries(fieldErrors)) {
          if (val && val[0]) errMap[key] = val[0];
        }
        setErrors(errMap);
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleProceedToPayment = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    try {
      setIsSubmitting(true);
      setServerError(null);

      // 1. Submit Registration Record to server
      const regRes = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const regData = await regRes.json();
      if (!regRes.ok) {
        throw new Error(regData.error || "Failed to create registration");
      }

      // 2. Redirect to payment checkout with registration ID
      router.push(`/register/checkout?id=${regData.registrationId}`);
    } catch (err: any) {
      console.error(err);
      setServerError(err.message || "Something went wrong. Please check your data and retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Official Audition Entry Form</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Dharti Aaba Birsa Jayanti 2026 Ramp Walk
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Fill in your details below. Fixed Entry Fee: <strong className="text-amber-400">₹{EVENT_DETAILS.registrationFee}</strong>
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} totalSteps={STEPS.length} steps={STEPS} />

      {/* Form Card Container */}
      <div className="mt-6 rounded-2xl border border-slate-800 bg-[#0C1220]/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        {serverError && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-xs text-red-300 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {currentStep === 1 && (
          <Step1BioData formData={formData} updateFormData={updateFormData} errors={errors} />
        )}
        {currentStep === 2 && (
          <Step2AddressContact formData={formData} updateFormData={updateFormData} errors={errors} />
        )}
        {currentStep === 3 && (
          <Step3Competition formData={formData} updateFormData={updateFormData} errors={errors} />
        )}
        {currentStep === 4 && (
          <Step4Photo formData={formData} updateFormData={updateFormData} errors={errors} />
        )}
        {currentStep === 5 && (
          <Step5Review
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            isSubmitting={isSubmitting}
            onProceedToPayment={handleProceedToPayment}
          />
        )}

        {/* Navigation Buttons (for steps 1 to 4) */}
        {currentStep < 5 && (
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              className="btn-primary-gold flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs sm:text-sm font-bold shadow-lg"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span>256-Bit SSL Encrypted Registration • Privacy Protected</span>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading form...</div>}>
          <RegistrationContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
