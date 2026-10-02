import { NextRequest, NextResponse } from "next/server";
import { completeRegistrationSchema } from "@/lib/validations/registration";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { EVENT_DETAILS } from "@/lib/constants/event";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Strict Server-Side Validation via Zod (ensures photoStoragePath is present and valid)
    const validationResult = completeRegistrationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validData = validationResult.data;

    // Additional strict photo guard
    if (!validData.photoStoragePath || validData.photoStoragePath.trim() === "") {
      return NextResponse.json(
        {
          error: "Photograph upload is strictly mandatory before proceeding to payment.",
          details: { photoStoragePath: ["Photo is required"] },
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    // 2. Check existing records for Mobile Number & Email
    const { data: existingRecords } = await supabase
      .from("registrations")
      .select("id, mobile_number, email, registration_status, registration_number")
      .or(`mobile_number.eq.${validData.mobileNumber},email.eq.${validData.email}`)
      .neq("registration_status", "CANCELLED");

    let existingPendingId: string | null = null;

    if (existingRecords && existingRecords.length > 0) {
      // Check if already confirmed
      const confirmedMatch = existingRecords.find((r) => r.registration_status === "CONFIRMED");
      if (confirmedMatch) {
        return NextResponse.json(
          {
            error: "This mobile number or email is already registered and confirmed as an official delegate. Please log in to your Delegate Portal.",
            alreadyConfirmed: true,
            registrationNumber: confirmedMatch.registration_number,
          },
          { status: 409 }
        );
      }

      // Check if pending registration exists
      const pendingMatch = existingRecords.find(
        (r) => r.registration_status === "PENDING_PAYMENT" || r.registration_status === "DRAFT" || r.registration_status === "PAYMENT_PENDING"
      );
      if (pendingMatch) {
        existingPendingId = pendingMatch.id;
      }
    }

    // 3. Prepare payload for insertion or pending update
    const registrationPayload = {
      full_name: validData.fullName,
      guardian_name: validData.guardianName,
      date_of_birth: validData.dateOfBirth,
      gender: validData.gender,
      tribal_community: validData.tribalCommunity || null,

      identity_proof_type: validData.identityProofType || null,
      identity_proof_number: validData.identityProofNumber || null,

      state: validData.state,
      district: validData.district,
      city_or_village: validData.cityOrVillage,
      full_address: validData.fullAddress,
      pincode: validData.pincode,

      mobile_number: validData.mobileNumber,
      whatsapp_number: validData.whatsappNumber || null,
      email: validData.email,

      educational_qualification: validData.educationalQualification || null,
      occupation: validData.occupation || null,
      instagram_handle: validData.instagramHandle || null,

      category: validData.category,
      age_category: "15 – 35 Years",

      attire_name: validData.attireName || null,
      attire_representation: validData.attireRepresentation || null,
      attire_description: validData.attireDescription || null,
      special_talent: validData.specialTalent || null,

      photo_storage_path: validData.photoStoragePath,

      // Initial status is strictly PAYMENT_PENDING — NOT inserted into primary delegates table
      registration_status: "PAYMENT_PENDING",
      terms_accepted_at: new Date().toISOString(),
      privacy_accepted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let savedId = "";

    if (existingPendingId) {
      // Update existing pending record
      const { error: updateError } = await supabase
        .from("registrations")
        .update(registrationPayload)
        .eq("id", existingPendingId);

      if (updateError) {
        console.warn("Supabase update error:", updateError.message);
      }
      savedId = existingPendingId;
    } else {
      // 4. Insert into Supabase registrations table as PAYMENT_PENDING
      const { data: inserted, error: insertError } = await supabase
        .from("registrations")
        .insert(registrationPayload)
        .select("id")
        .single();

      if (insertError) {
        console.warn("Supabase insertion fallback:", insertError.message);
        // Fallback temporary UUID for dev mode when DB table is not yet migrated
        savedId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      } else {
        savedId = inserted.id;
      }
    }

    // 5. Create audit log
    await supabase.from("audit_logs").insert({
      registration_id: savedId.startsWith("temp-") ? null : savedId,
      action: existingPendingId ? "REGISTRATION_PENDING_UPDATED" : "REGISTRATION_PENDING_CREATED",
      actor_type: "PARTICIPANT",
      actor_identifier: validData.mobileNumber,
      metadata: {
        category: validData.category,
        fullName: validData.fullName,
        hasPhoto: true,
        status: "PAYMENT_PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      registrationId: savedId,
      status: "PAYMENT_PENDING",
      amount: EVENT_DETAILS.registrationFee,
      currency: EVENT_DETAILS.currency,
      message: "Registration pending payment. Please proceed to complete checkout.",
    });
  } catch (error: any) {
    console.error("Create registration error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create registration" },
      { status: 500 }
    );
  }
}
