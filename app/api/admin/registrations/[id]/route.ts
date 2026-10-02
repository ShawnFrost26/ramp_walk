import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = getSupabaseServerClient();

    // 1. Fetch registration
    const { data: registration, error: regError } = await supabase
      .from("registrations")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (regError || !registration) {
      return NextResponse.json({ error: "Registration record not found" }, { status: 404 });
    }

    // 2. Fetch latest payment attempt
    const { data: payment } = await supabase
      .from("payment_attempts")
      .select("*")
      .eq("registration_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 3. Resolve photo URL (Fallback to internal photo proxy endpoint)
    let photoUrl = `/api/admin/registrations/${id}/photo`;

    if (registration.photo_storage_path) {
      if (
        registration.photo_storage_path.startsWith("data:") ||
        registration.photo_storage_path.startsWith("http://") ||
        registration.photo_storage_path.startsWith("https://")
      ) {
        photoUrl = registration.photo_storage_path;
      } else {
        try {
          const { data: signedData } = await supabase.storage
            .from("registration-photos")
            .createSignedUrl(registration.photo_storage_path, 7200);
          if (signedData?.signedUrl) {
            photoUrl = signedData.signedUrl;
          }
        } catch (e) {
          console.warn("Storage sign URL warning:", e);
        }
      }
    }

    return NextResponse.json({
      success: true,
      registration,
      payment: payment || null,
      photo_url: photoUrl,
    });
  } catch (error: any) {
    console.error("Admin get registration error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch registration details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const supabase = getSupabaseServerClient();

    // Allowed fields that admin can edit
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    const allowedFields = [
      "full_name",
      "guardian_name",
      "date_of_birth",
      "gender",
      "tribal_community",
      "identity_proof_type",
      "identity_proof_number",
      "state",
      "district",
      "city_or_village",
      "full_address",
      "pincode",
      "mobile_number",
      "whatsapp_number",
      "email",
      "educational_qualification",
      "occupation",
      "instagram_handle",
      "category",
      "age_category",
      "attire_name",
      "attire_representation",
      "attire_description",
      "special_talent",
      "registration_status",
      "registration_number",
      "photo_storage_path",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updatePayload[field] = body[field];
      }
    }

    // If changing to CONFIRMED
    if (updatePayload.registration_status === "CONFIRMED") {
      updatePayload.confirmed_at = new Date().toISOString();
      if (!updatePayload.registration_number) {
        updatePayload.registration_number = `TH2026-${Math.floor(1000 + Math.random() * 9000)}`;
      }
    }

    // 1. Update registrations database record
    const { data: updated, error: updateError } = await supabase
      .from("registrations")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      console.error("Admin update registration error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    // 2. Synchronize delegates primary table
    if (updated.registration_status === "CONFIRMED") {
      await supabase.from("delegates").upsert({
        registration_id: id,
        is_active: true,
        updated_at: new Date().toISOString(),
      });
    } else if (updated.registration_status === "CANCELLED") {
      await supabase
        .from("delegates")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("registration_id", id);
    }

    // 3. Synchronize Google Sheets Jobs
    await supabase.from("sheet_sync_jobs").insert({
      registration_id: id,
      status: "PENDING",
    });

    // 4. Record Detailed Audit Log
    await supabase.from("audit_logs").insert({
      registration_id: id,
      action: "ADMIN_DELEGATE_UPDATED",
      actor_type: "ADMIN",
      actor_identifier: "ADMIN_CONSOLE",
      metadata: {
        updatedFields: Object.keys(updatePayload),
        registrationNumber: updated.registration_number,
        fullName: updated.full_name,
        newStatus: updated.registration_status,
      },
    });

    return NextResponse.json({
      success: true,
      registration: updated,
      message: "Delegate record successfully updated and synchronized across all tables and pass views.",
    });
  } catch (error: any) {
    console.error("Admin update registration exception:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update registration" },
      { status: 500 }
    );
  }
}
