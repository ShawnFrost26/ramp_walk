import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { mobileNumber, email } = await req.json();

    if (!mobileNumber && !email) {
      return NextResponse.json({ available: true });
    }

    const supabase = getSupabaseServerClient();

    if (mobileNumber) {
      const { data: existingMobile, error: mobileError } = await supabase
        .from("registrations")
        .select("id, registration_status")
        .eq("mobile_number", mobileNumber)
        .neq("registration_status", "CANCELLED")
        .maybeSingle();

      if (mobileError && mobileError.code !== "PGRST116") {
        // If Supabase is not reachable, do not hard-block locally
        console.warn("Supabase check warning:", mobileError.message);
      } else if (existingMobile) {
        return NextResponse.json({
          available: false,
          field: "mobileNumber",
          message: "This mobile number is already registered for this event.",
        });
      }
    }

    if (email) {
      const { data: existingEmail, error: emailError } = await supabase
        .from("registrations")
        .select("id, registration_status")
        .eq("email", email.toLowerCase())
        .neq("registration_status", "CANCELLED")
        .maybeSingle();

      if (emailError && emailError.code !== "PGRST116") {
        console.warn("Supabase check warning:", emailError.message);
      } else if (existingEmail) {
        return NextResponse.json({
          available: false,
          field: "email",
          message: "This email address is already registered for this event.",
        });
      }
    }

    return NextResponse.json({ available: true });
  } catch (error: any) {
    console.error("Availability check error:", error);
    return NextResponse.json({ available: true }); // Graceful fallback
  }
}
