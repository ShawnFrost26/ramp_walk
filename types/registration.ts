export type RegistrationStatus = "DRAFT" | "PAYMENT_PENDING" | "CONFIRMED" | "CANCELLED";
export type PaymentStatus = "CREATED" | "AUTHORIZED" | "CAPTURED" | "FAILED" | "REFUNDED";
export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface RegistrationFormData {
  // Step 1: Participant Bio-Data
  fullName: string;
  guardianName: string;
  dateOfBirth: string;
  gender: Gender;
  tribalCommunity?: string;

  // Step 2: Identification & Address
  identityProofType?: string;
  identityProofNumber?: string;
  state: string;
  district: string;
  cityOrVillage: string;
  fullAddress: string;
  pincode: string;
  mobileNumber: string;
  whatsappNumber?: string;
  email: string;
  educationalQualification?: string;
  occupation?: string;
  instagramHandle?: string;

  // Step 3: Competition & Cultural Attire
  category: string;
  ageCategory?: string;
  attireName?: string;
  attireRepresentation?: string;
  attireDescription?: string;
  specialTalent?: string;

  // Step 4: Photo
  photoStoragePath?: string;
  photoPreviewUrl?: string;

  // Step 5: Terms & Consent
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

export interface RegistrationRecord {
  id: string;
  registration_number: string | null;
  full_name: string;
  guardian_name: string;
  date_of_birth: string;
  gender: Gender;
  tribal_community: string | null;
  identity_proof_type: string | null;
  identity_proof_number: string | null;
  identity_proof_storage_path: string | null;
  state: string;
  district: string;
  city_or_village: string;
  full_address: string;
  pincode: string;
  mobile_number: string;
  whatsapp_number: string | null;
  email: string;
  educational_qualification: string | null;
  occupation: string | null;
  instagram_handle: string | null;
  category: string;
  age_category: string | null;
  attire_name: string | null;
  attire_representation: string | null;
  attire_description: string | null;
  special_talent: string | null;
  photo_storage_path: string | null;
  registration_status: RegistrationStatus;
  terms_accepted_at: string | null;
  privacy_accepted_at: string | null;
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
}

export interface PaymentAttemptRecord {
  id: string;
  registration_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  signature_verified: boolean;
  failure_code: string | null;
  failure_reason: string | null;
  provider_created_at: string | null;
  captured_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DelegateRecord {
  id: string;
  registration_id: string;
  auth_user_id: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  registration?: RegistrationRecord;
}
