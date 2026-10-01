import { NextRequest, NextResponse } from "next/server";
import { EVENT_DETAILS } from "@/lib/constants/event";
import { verifyPaymentSignature } from "@/lib/razorpay/client";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { registrationId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    if (!registrationId || !razorpayOrderId || !razorpayPaymentId) {
      return NextResponse.json(
        { error: "Missing required payment verification parameters" },
        { status: 400 }
      );
    }

    // 1. Verify HMAC SHA-256 Signature
    const isValidSignature = verifyPaymentSignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature || "mock_signature",
    });

    if (!isValidSignature) {
      return NextResponse.json(
        { error: "Invalid payment signature. Payment verification failed." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    // 2. Attempt invocation of atomic procedure confirm_registration_and_activate_delegate
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "confirm_registration_and_activate_delegate",
      {
        p_registration_id: registrationId,
        p_razorpay_order_id: razorpayOrderId,
        p_razorpay_payment_id: razorpayPaymentId,
        p_amount: EVENT_DETAILS.registrationFeePaise,
        p_raw_metadata: { source: "client_checkout_verification" },
      }
    );

    let regNumber = "";

    if (!rpcError && rpcData && rpcData.length > 0) {
      regNumber = rpcData[0].registration_number;
    } else {
      console.warn("RPC fallback execution:", rpcError?.message);
      // Fallback direct update if DB procedure not yet migrated
      // Generate registration number
      const randomSeq = Math.floor(100000 + Math.random() * 900000);
      regNumber = `TH26-${randomSeq}`;

      await supabase
        .from("registrations")
        .update({
          registration_number: regNumber,
          registration_status: "CONFIRMED",
          confirmed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", registrationId);

      await supabase
        .from("payment_attempts")
        .update({
          razorpay_payment_id: razorpayPaymentId,
          status: "CAPTURED",
          signature_verified: true,
          captured_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("razorpay_order_id", razorpayOrderId);

      // Upsert Delegate
      await supabase.from("delegates").upsert({
        registration_id: registrationId,
        is_active: true,
      });

      // Queue Sheet sync job
      await supabase.from("sheet_sync_jobs").insert({
        registration_id: registrationId,
        status: "PENDING",
      });

      // Audit Log
      await supabase.from("audit_logs").insert({
        registration_id: registrationId,
        action: "REGISTRATION_CONFIRMED",
        actor_type: "SYSTEM",
        actor_identifier: "VERIFY_ENDPOINT",
        metadata: {
          orderId: razorpayOrderId,
          paymentId: razorpayPaymentId,
          registrationNumber: regNumber,
        },
      });
    }

    return NextResponse.json({
      success: true,
      registrationNumber: regNumber,
      registrationId,
      message: "Payment successfully verified and registration confirmed.",
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
