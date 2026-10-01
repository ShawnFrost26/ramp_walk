import crypto from "crypto";
import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "placeholder_webhook_secret";

export function getRazorpayClient(): Razorpay {
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Verify Razorpay payment signature from client checkout
 * Formula: HMAC_SHA256(order_id + "|" + payment_id, secret) == signature
 */
export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!keySecret || keySecret === "placeholder_secret") {
    // In dev simulation mode with placeholder keys, allow test validation
    return true;
  }
  const body = `${params.orderId}|${params.paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(params.signature, "utf-8")
    );
  } catch {
    return false;
  }
}

/**
 * Verify Razorpay webhook signature header (X-Razorpay-Signature)
 */
export function verifyWebhookSignature(payloadRawBody: string, signature: string): boolean {
  if (!webhookSecret || webhookSecret === "placeholder_webhook_secret") {
    return true;
  }
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(payloadRawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(signature, "utf-8")
    );
  } catch {
    return false;
  }
}
