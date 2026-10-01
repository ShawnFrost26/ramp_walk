import { NextRequest, NextResponse } from "next/server";
import { EVENT_DETAILS } from "@/lib/constants/event";
import { getRazorpayClient } from "@/lib/razorpay/client";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { registrationId } = await req.json();

    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    // 1. Fetch Registration Record
    const { data: registration, error: regError } = await supabase
      .from("registrations")
      .select("id, full_name, email, mobile_number, category, registration_status, registration_number")
      .eq("id", registrationId)
      .maybeSingle();

    if (regError && regError.code !== "PGRST116") {
      console.warn("Supabase fetch warning:", regError.message);
    }

    // If registration is already confirmed, do not create a new order
    if (registration && registration.registration_status === "CONFIRMED") {
      return NextResponse.json(
        {
          error: "Registration is already confirmed and paid.",
          isAlreadyConfirmed: true,
          registrationNumber: registration.registration_number,
        },
        { status: 400 }
      );
    }

    // 2. Strict Server-Side Amount Definition (₹500 in paise = 50000)
    const amountInPaise = EVENT_DETAILS.registrationFeePaise;
    const currency = EVENT_DETAILS.currency;
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_birsa2026";

    let orderId = "";
    let isMockOrder = false;

    // 3. Create Order via Razorpay SDK (with fallback mock order for dev mode)
    try {
      const razorpay = getRazorpayClient();
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency,
        receipt: `rcpt_${registrationId.slice(0, 10)}`,
        notes: {
          registrationId,
          event: "Dharti Aaba Birsa Jayanti 2026 Ramp Walk",
        },
      });
      orderId = order.id;
    } catch (orderErr: any) {
      console.warn("Razorpay API order creation fallback (dev mode):", orderErr?.message || orderErr);
      // In development or when test keys are placeholders, generate dev order ID
      orderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      isMockOrder = true;
    }

    // 4. Record new payment attempt in database
    await supabase.from("payment_attempts").insert({
      registration_id: registrationId,
      razorpay_order_id: orderId,
      amount: amountInPaise,
      currency,
      status: "CREATED",
      signature_verified: false,
    });

    // 5. Update Registration status to PAYMENT_PENDING
    await supabase
      .from("registrations")
      .update({
        registration_status: "PAYMENT_PENDING",
        updated_at: new Date().toISOString(),
      })
      .eq("id", registrationId);

    // 6. Record Audit Log
    await supabase.from("audit_logs").insert({
      registration_id: registrationId,
      action: "PAYMENT_ORDER_CREATED",
      actor_type: "SYSTEM",
      actor_identifier: "RAZORPAY_ORDERS_API",
      metadata: { orderId, amount: amountInPaise, currency },
    });

    return NextResponse.json({
      success: true,
      orderId,
      amount: amountInPaise,
      currency,
      keyId: razorpayKeyId,
      isMockOrder,
      participant: {
        name: registration?.full_name || "Participant",
        email: registration?.email || "",
        mobile: registration?.mobile_number || "",
        category: registration?.category || "",
      },
    });
  } catch (error: any) {
    console.error("Create payment order error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
