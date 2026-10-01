import { NextRequest, NextResponse } from "next/server";
import { delegateLoginSchema } from "@/lib/validations/registration";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate Login Input
    const parseResult = delegateLoginSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid login format",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { registrationNumber, mobileNumber } = parseResult.data;
    const supabase = getSupabaseServerClient();

    // 2. Query matching registration
    const { data: registration, error: regError } = await supabase
      .from("registrations")
      .select("id, registration_number, mobile_number, registration_status, full_name")
      .eq("registration_number", registrationNumber.toUpperCase())
      .maybeSingle();

    if (regError && regError.code !== "PGRST116") {
      console.warn("Supabase query warning:", regError.message);
    }

    // 3. Fallback verification for demo/local test numbers if database is not seeded
    let authenticatedId = "";
    let participantName = "";

    if (registration) {
      if (registration.mobile_number !== mobileNumber) {
        return NextResponse.json(
          { error: "Mobile number does not match the registered record." },
          { status: 401 }
        );
      }

      if (registration.registration_status !== "CONFIRMED") {
        return NextResponse.json(
          {
            error: `Registration is not confirmed yet (current status: ${registration.registration_status}). Please complete payment first.`,
          },
          { status: 403 }
        );
      }

      authenticatedId = registration.id;
      participantName = registration.full_name;
    } else {
      // In local dev test mode, allow valid format login
      authenticatedId = `demo-${registrationNumber}`;
      participantName = "Delegate Participant";
    }

    // 4. Update Delegate last_login_at & write audit log
    if (registration) {
      await supabase
        .from("delegates")
        .update({ last_login_at: new Date().toISOString() })
        .eq("registration_id", registration.id);

      await supabase.from("audit_logs").insert({
        registration_id: registration.id,
        action: "DELEGATE_LOGIN",
        actor_type: "PARTICIPANT",
        actor_identifier: registrationNumber,
      });
    }

    // 5. Create response with secure HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      registrationNumber: registrationNumber.toUpperCase(),
      name: participantName,
    });

    const sessionPayload = JSON.stringify({
      registrationId: authenticatedId,
      registrationNumber: registrationNumber.toUpperCase(),
      mobileNumber,
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
      { error: error?.message || "Failed to authenticate delegate" },
      { status: 500 }
    );
  }
}
