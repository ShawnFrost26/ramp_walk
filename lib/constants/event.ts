const configuredFee = Number(process.env.NEXT_PUBLIC_REGISTRATION_FEE) || 500;

export const EVENT_DETAILS = {
  name: "Dharti Aaba Veer Birsa Munda Jayanti 2026",
  subTitle: "Grand Ramp Walk Competition & Audition Promotion",
  tagline: "Celebrating Tribal Heritage, Pride, Elegance & Culture",
  year: 2026,
  edition: "Annual Commemorative Edition",
  registrationFee: configuredFee, // INR
  registrationFeePaise: configuredFee * 100, // Amount in paise for Razorpay
  currency: "INR",
  dates: {
    audition: "October 2026",
    grandFinale: "15 November 2026 (Birsa Munda Jayanti)",
  },
  location: "Rourkela, Sundargarh, Odisha",
  organizer: "Dharti Aaba Birsa Munda Jayanti Committee",
  contact: {
    phone: "+91 94370 00000",
    email: "support@birsa-jayanti2026.org",
    whatsapp: "+91 94370 00000",
  },
  maxPhotoSizeMB: 5,
  maxPhotoSizeBytes: 5 * 1024 * 1024,
  allowedPhotoTypes: ["image/jpeg", "image/png", "image/webp"],
};

export const COMPETITION_CATEGORIES = [
  { id: "mr_rourkela", title: "Mr Rourkela 2026", gender: "MALE", subtitle: "Male Ramp Walk & Cultural Modeling" },
  { id: "miss_rourkela", title: "Miss Rourkela 2026", gender: "FEMALE", subtitle: "Female Ramp Walk & Cultural Modeling" },
  { id: "traditional_solo", title: "Traditional Tribal Solo", gender: "ANY", subtitle: "Solo Indigenous Attire & Presentation" },
  { id: "traditional_duo", title: "Traditional Tribal Duo", gender: "ANY", subtitle: "Couple / Duo Traditional Presentation" },
] as const;

export const AGE_CATEGORIES = [
  { id: "junior", label: "Junior (14 – 17 Years)", minAge: 14, maxAge: 17 },
  { id: "youth", label: "Youth / Main (18 – 28 Years)", minAge: 18, maxAge: 28 },
  { id: "open", label: "Open Group (29+ Years)", minAge: 29, maxAge: 100 },
] as const;

export const IDENTITY_PROOF_TYPES = [
  "Aadhaar Card",
  "Voter ID Card",
  "College / School ID Card",
  "Driving License",
  "Passport",
  "Other Valid Govt ID",
] as const;

export const PROMINENT_TRIBES = [
  "Munda",
  "Santhal",
  "Oraon / Kurukh",
  "Ho",
  "Kharia",
  "Kisan",
  "Gond",
  "Bhumij",
  "Kolha",
  "Bathudi",
  "Other Tribal Community",
] as const;
