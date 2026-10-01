import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay/client";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    // 1. Verify Webhook Signature
    const isSignatureValid = verifyWebhookSignature(rawBody, signature);
    if (!isSignatureValid) {
      console.error("Invalid Razorpay webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || payload.id || `evt_${Date.now()}`;
    const eventType = payload.event || "unknown";

    const supabase = getSupabaseServerClient();

    // 2. Idempotency Check: Prevent duplicate webhook processing
    const { data: existingEvent } = await supabase
      .from("webhook_events")
      .select("id, processing_status")
      .eq("event_id", eventId)
      .maybeSingle();

    if (existingEvent) {
      console.log(`Webhook event ${eventId} already received. Skipping duplicate processing.`);
      return NextResponse.json({ status: "duplicate_acknowledged" }, { status: 200 });
    }

    // 3. Record Webhook Event in database
    await supabase.from("webhook_events").insert({
      provider: "razorpay",
      event_id: eventId,
      event_type: eventType,
      signature_valid: true,
      payload: payload,
      processing_status: "RECEIVED",
    });

    // 4. Handle Specific Event Types
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;
      const amount = paymentEntity?.amount || 50000;

      if (orderId) {
        // Find registration ID associated with this order
        const { data: attempt } = await supabase
          .from("payment_attempts")
          .select("registration_id, status")
          .eq("razorpay_order_id", orderId)
          .maybeSingle();

        if (attempt?.registration_id) {
          // Confirm registration & activate delegate atomically
          await supabase.rpc("confirm_registration_and_activate_delegate", {
            p_registration_id: attempt.registration_id,
            p_razorpay_order_id: orderId,
            p_razorpay_payment_id: paymentId,
            p_amount: amount,
            p_raw_metadata: { source: "razorpay_webhook", event_id: eventId },
          });

          // Mark webhook as processed
          await supabase
            .from("webhook_events")
            .update({
              processing_status: "PROCESSED",
              processed_at: new Date().toISOString(),
            })
            .eq("event_id", eventId);
        }
      }
    } else if (eventType === "payment.failed") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;

      if (orderId) {
        await supabase
          .from("payment_attempts")
          .update({
            status: "FAILED",
            failure_code: paymentEntity?.error_code || "PAYMENT_FAILED",
            failure_reason: paymentEntity?.error_description || "Payment failed",
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_order_id", orderId);

        await supabase
          .from("webhook_events")
          .update({
            processing_status: "PROCESSED",
            processed_at: new Date().toISOString(),
          })
          .eq("event_id", eventId);
      }
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay webhook handler error:", error);
    return NextResponse.json(
      { error: error?.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
