import { z } from "zod";

const indianMobileRegex = /^[6-9]\d{9}$/;
const pincodeRegex = /^\d{6}$/;

export const step1BioDataSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "Name should only contain letters, spaces, and standard punctuation"),
  guardianName: z
    .string()
    .trim()
    .min(2, "Guardian / Parent name must be at least 2 characters")
    .max(100, "Guardian name cannot exceed 100 characters"),
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date of birth")
    .refine((val) => new Date(val) < new Date(), "Date of birth must be in the past"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),
  tribalCommunity: z.string().trim().max(100).optional().or(z.literal("")),
});

export const step2AddressContactSchema = z.object({
  identityProofType: z.string().trim().optional().or(z.literal("")),
  identityProofNumber: z.string().trim().max(50).optional().or(z.literal("")),
  state: z.string().trim().min(2, "State is required"),
  district: z.string().trim().min(2, "District is required"),
  cityOrVillage: z.string().trim().min(2, "City / Village is required"),
  fullAddress: z.string().trim().min(5, "Complete address is required").max(300),
  pincode: z
    .string()
    .trim()
    .regex(pincodeRegex, "Please enter a valid 6-digit PIN code"),
  mobileNumber: z
    .string()
    .trim()
    .regex(indianMobileRegex, "Enter a valid 10-digit Indian mobile number (e.g. 9876543210)"),
  whatsappNumber: z
    .string()
    .trim()
    .regex(indianMobileRegex, "Enter a valid 10-digit WhatsApp number")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address"),
  educationalQualification: z.string().trim().max(100).optional().or(z.literal("")),
  occupation: z.string().trim().max(100).optional().or(z.literal("")),
  instagramHandle: z.string().trim().max(100).optional().or(z.literal("")),
});

export const step3CompetitionSchema = z.object({
  category: z.string().min(1, "Please select a competition category"),
  ageCategory: z.string().optional().or(z.literal("")),
  attireName: z.string().trim().max(150).optional().or(z.literal("")),
  attireRepresentation: z.string().trim().max(150).optional().or(z.literal("")),
  attireDescription: z.string().trim().max(500).optional().or(z.literal("")),
  specialTalent: z.string().trim().max(500).optional().or(z.literal("")),
});

export const step4PhotoSchema = z.object({
  photoStoragePath: z
    .string({ required_error: "Photograph upload is strictly mandatory." })
    .trim()
    .min(1, "Profile photograph is strictly mandatory. Please upload a clear portrait photo before proceeding."),
  photoPreviewUrl: z.string().optional().or(z.literal("")),
});

export const step5ReviewConsentSchema = z.object({
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the event terms and conditions to proceed" }),
  }),
  privacyAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the privacy policy to proceed" }),
  }),
});

// Full combined schema for backend submission
export const completeRegistrationSchema = step1BioDataSchema
  .merge(step2AddressContactSchema)
  .merge(step3CompetitionSchema)
  .merge(step4PhotoSchema)
  .merge(step5ReviewConsentSchema);

export type CompleteRegistrationInput = z.infer<typeof completeRegistrationSchema>;

// Delegate login schema - Phone Number and Date of Birth
export const delegateLoginSchema = z.object({
  mobileNumber: z
    .string({ required_error: "Mobile number is required" })
    .trim()
    .regex(indianMobileRegex, "Enter a valid 10-digit Indian mobile number"),
  dateOfBirth: z
    .string({ required_error: "Date of birth is required" })
    .trim()
    .refine((val) => !isNaN(Date.parse(val)), "Please enter a valid date of birth (YYYY-MM-DD)"),
});

