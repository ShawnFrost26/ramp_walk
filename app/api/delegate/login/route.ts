import { NextRequest, NextResponse } from "next/server";
import { delegateLoginSchema } from "@/lib/validations/registration";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate Login Input (Mobile Number & Date of Birth)
    const parseResult = delegateLoginSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid login credentials format",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { mobileNumber, dateOfBirth } = parseResult.data;
    const supabase = getSupabaseServerClient();

    // 2. Query matching registration by Mobile Number and Date of Birth
    const { data: registration, error: regError } = await supabase
      .from("registrations")
      .select("id, registration_number, mobile_number, date_of_birth, registration_status, full_name, photo_storage_path")
      .eq("mobile_number", mobileNumber)
      .eq("date_of_birth", dateOfBirth)
      .maybeSingle();

    if (regError && regError.code !== "PGRST116") {
      console.warn("Supabase delegate login query warning:", regError.message);
    }

    let authenticatedRegistration = registration;

    // Local dev test fallback if DB is empty or disconnected
    if (!authenticatedRegistration && process.env.NODE_ENV !== "production") {
      // Mock test account for seamless testing
      if (mobileNumber === "9876543210" || mobileNumber === "9437000000") {
        authenticatedRegistration = {
          id: `demo-${Date.now()}`,
          registration_number: "TH2026-1001",
          mobile_number: mobileNumber,
          date_of_birth: dateOfBirth,
          registration_status: "CONFIRMED",
          full_name: "Birsa Samad",
          photo_storage_path: "mock/participants/sample.jpg",
        };
      } else if (mobileNumber.endsWith("00")) {
        // Pending payment mock test account
        authenticatedRegistration = {
          id: `pending-${Date.now()}`,
          registration_number: null,
          mobile_number: mobileNumber,
          date_of_birth: dateOfBirth,
          registration_status: "PENDING_PAYMENT",
          full_name: "Applicant Incomplete",
          photo_storage_path: "mock/participants/pending.jpg",
        };
      }
    }

    if (!authenticatedRegistration) {
      return NextResponse.json(
        {
          error: "No registration found with this mobile number and date of birth. Please check your details or submit a new registration.",
        },
        { status: 401 }
      );
    }

    const isPendingPayment =
      authenticatedRegistration.registration_status === "PENDING_PAYMENT" ||
      authenticatedRegistration.registration_status === "DRAFT" ||
      authenticatedRegistration.registration_status === "PAYMENT_PENDING";

    // 3. Update last_login_at in delegates table if confirmed
    if (!isPendingPayment && authenticatedRegistration.id && !authenticatedRegistration.id.startsWith("demo-")) {
      await supabase
        .from("delegates")
        .update({ last_login_at: new Date().toISOString() })
        .eq("registration_id", authenticatedRegistration.id);

      await supabase.from("audit_logs").insert({
        registration_id: authenticatedRegistration.id,
        action: "DELEGATE_LOGIN",
        actor_type: "PARTICIPANT",
        actor_identifier: mobileNumber,
      });
    }

    // 4. Create response with secure HTTP-only session cookie
    const response = NextResponse.json({
      success: true,
      status: authenticatedRegistration.registration_status,
      isPending: isPendingPayment,
      registrationId: authenticatedRegistration.id,
      registrationNumber: authenticatedRegistration.registration_number || null,
      name: authenticatedRegistration.full_name,
      message: isPendingPayment
        ? "Registration incomplete. Please complete payment to activate your Delegate Pass."
        : "Login successful.",
    });

    const sessionPayload = JSON.stringify({
      registrationId: authenticatedRegistration.id,
      registrationNumber: authenticatedRegistration.registration_number || null,
      mobileNumber: authenticatedRegistration.mobile_number,
      dateOfBirth: authenticatedRegistration.date_of_birth,
      status: authenticatedRegistration.registration_status,
      isPending: isPendingPayment,
    });

    response.cookies.set("delegate_session", Buffer.from(sessionPayload).toString("base64"), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Delegate login error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process login request" },
      { status: 500 }
    );
  }
}
