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
  location: "Sector-13, Ground, Rourkela, Near airport",
  venue: {
    address: "Sector-13, Ground",
    city: "Rourkela",
    landmark: "Near airport",
  },
  organizer: "Dharti Aaba Birsa Munda Jayanti Committee",
  email: "veerbirsamunda5@gmail.com",
  contact: {
    phone: "8917598855",
    whatsapp: "90787 07579",
    email: "veerbirsamunda5@gmail.com",
    operatingHours: "Monday to Saturday: 10:30 AM – 05:30 PM IST",
  },
  maxPhotoSizeMB: 1,
  maxPhotoSizeBytes: 1 * 1024 * 1024,
  allowedPhotoTypes: ["image/jpeg", "image/png", "image/webp"],
};

export const COMPETITION_CATEGORIES = [
  { id: "mr_rourkela", title: "Mr Rourkela 2026", gender: "MALE", subtitle: "Male Ramp Walk & Cultural Modeling" },
  { id: "miss_rourkela", title: "Miss Rourkela 2026", gender: "FEMALE", subtitle: "Female Ramp Walk & Cultural Modeling" },
  { id: "traditional_solo", title: "Traditional Tribal Solo", gender: "ANY", subtitle: "Solo Indigenous Attire & Presentation" },
  { id: "traditional_duo", title: "Traditional Tribal Duo", gender: "ANY", subtitle: "Couple / Duo Traditional Presentation" },
] as const;

export const AGE_LIMIT_CRITERIA = {
  minAge: 15,
  maxAge: 35,
  label: "15 – 35 Years",
  title: "Age Limit: 15 – 35 Years (Eligible Participant)",
  description: "Official Ramp Walk participant age criterion. Participant must be between 15 and 35 years old.",
} as const;

export const AGE_CATEGORIES = [
  { id: "standard", label: "15 – 35 Years", minAge: 15, maxAge: 35 },
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
