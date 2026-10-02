import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("delegate_session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false, error: "Not logged in" }, { status: 401 });
    }

    // Decode session payload
    const decoded = Buffer.from(sessionCookie, "base64").toString("utf-8");
    const session = JSON.parse(decoded);

    const supabase = getSupabaseServerClient();

    // Query registration details
    let registration: any = null;

    if (session.registrationId && !session.registrationId.startsWith("demo-") && !session.registrationId.startsWith("pending-")) {
      const { data, error: regError } = await supabase
        .from("registrations")
        .select("*")
        .eq("id", session.registrationId)
        .maybeSingle();

      if (regError && regError.code !== "PGRST116") {
        console.warn("Supabase delegate query warning:", regError.message);
      }
      registration = data;
    }

    if (!registration && session.mobileNumber && session.dateOfBirth) {
      const { data, error: regError } = await supabase
        .from("registrations")
        .select("*")
        .eq("mobile_number", session.mobileNumber)
        .eq("date_of_birth", session.dateOfBirth)
        .maybeSingle();

      if (regError && regError.code !== "PGRST116") {
        console.warn("Supabase delegate fallback query warning:", regError.message);
      }
      registration = data;
    }

    if (registration) {
      // 1. Resolve secure photo URL via Supabase Storage signed URL
      let resolvedPhotoUrl = "";
      if (registration.photo_storage_path) {
        if (
          registration.photo_storage_path.startsWith("data:") ||
          registration.photo_storage_path.startsWith("http://") ||
          registration.photo_storage_path.startsWith("https://")
        ) {
          resolvedPhotoUrl = registration.photo_storage_path;
        } else {
          // Attempt to generate 2-hour signed URL for private bucket
          try {
            const { data: signedData, error: signError } = await supabase.storage
              .from("registration-photos")
              .createSignedUrl(registration.photo_storage_path, 7200);

            if (!signError && signedData?.signedUrl) {
              resolvedPhotoUrl = signedData.signedUrl;
            } else {
              // Try public URL if bucket is configured public
              const { data: publicData } = supabase.storage
                .from("registration-photos")
                .getPublicUrl(registration.photo_storage_path);
              resolvedPhotoUrl = publicData?.publicUrl || "";
            }
          } catch (e) {
            console.warn("Signed URL generation warning:", e);
          }
        }
      }

      // 2. Query latest payment attempt
      const { data: payment } = await supabase
        .from("payment_attempts")
        .select("*")
        .eq("registration_id", registration.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const isPendingPayment =
        registration.registration_status === "PENDING_PAYMENT" ||
        registration.registration_status === "DRAFT" ||
        registration.registration_status === "PAYMENT_PENDING";

      return NextResponse.json({
        authenticated: true,
        delegate: {
          ...registration,
          photo_url: resolvedPhotoUrl || null,
          isPendingPayment,
          payment: payment || null,
        },
      });
    }

    // Dev Fallback for local demo preview
    const isMockPending = session.isPending || session.status === "PENDING_PAYMENT";
    return NextResponse.json({
      authenticated: true,
      delegate: {
        id: session.registrationId || "demo-mock-id",
        registration_number: isMockPending ? null : (session.registrationNumber || "TH2026-1001"),
        full_name: isMockPending ? "Birsa Samad (Pending)" : "Birsa Samad",
        guardian_name: "Sukhram Samad",
        date_of_birth: session.dateOfBirth || "2002-05-14",
        gender: "MALE",
        tribal_community: "Munda",
        mobile_number: session.mobileNumber || "9876543210",
        email: "birsa.participant@example.com",
        category: "Mr Rourkela 2026",
        age_category: "Youth / Main (18 – 28 Years)",
        attire_name: "Munda Tar-Gamcha & Silk Kurta",
        attire_representation: "Traditional Munda Warrior Attire",
        attire_description:
          "Hand-woven cotton and tasar silk with tribal arrow and tree motifs, symbolizing courage and nature harmony.",
        state: "Odisha",
        district: "Sundargarh",
        city_or_village: "Rourkela",
        full_address: "Sector 4, Near Birsa Munda Stadium, Rourkela",
        pincode: "769002",
        photo_storage_path: "mock/participants/sample.jpg",
        photo_url: null, // Will trigger elegant fallback avatar with initials/icon in UI
        registration_status: isMockPending ? "PENDING_PAYMENT" : "CONFIRMED",
        isPendingPayment: isMockPending,
        created_at: new Date().toISOString(),
        confirmed_at: isMockPending ? null : new Date().toISOString(),
        payment: isMockPending
          ? null
          : {
              amount: 50000,
              currency: "INR",
              status: "CAPTURED",
              razorpay_payment_id: "pay_confirmed_101",
            },
      },
    });
  } catch (error: any) {
    console.error("Delegate profile fetch error:", error);
    return NextResponse.json(
      { authenticated: false, error: "Failed to retrieve delegate profile" },
      { status: 500 }
    );
  }
}
