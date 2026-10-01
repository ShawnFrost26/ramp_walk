"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { EVENT_DETAILS } from "@/lib/constants/event";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldCheck,
  CreditCard,
  Sparkles,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  // Load Razorpay Checkout Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Fetch or Create Razorpay Order
  useEffect(() => {
    if (!registrationId) {
      setError("No registration ID found. Please start registration from step 1.");
      setIsLoading(false);
      return;
    }

    const initOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch("/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ registrationId }),
        });

        const data = await res.json();
        if (!res.ok) {
          if (data.isAlreadyConfirmed) {
            router.push(`/register/success?id=${registrationId}&reg=${data.registrationNumber}`);
            return;
          }
          throw new Error(data.error || "Failed to initialize payment order");
        }

        setOrderData(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Could not initialize checkout. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initOrder();
  }, [registrationId, router]);

  // Handle Real Razorpay Checkout Modal
  const launchRazorpayCheckout = () => {
    if (!orderData) return;

    if (!window.Razorpay) {
      // If script is not yet loaded, simulate or prompt
      handleSimulatePayment();
      return;
    }

    setIsProcessing(true);

    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Dharti Aaba Birsa Jayanti 2026",
      description: "Ramp Walk Registration Fee (Miss & Mr Rourkela)",
      order_id: orderData.orderId,
      prefill: {
        name: orderData.participant?.name || "",
        email: orderData.participant?.email || "",
        contact: orderData.participant?.mobile || "",
      },
      theme: {
        color: "#D97706",
      },
      handler: async function (response: any) {
        try {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              registrationId,
              razorpayOrderId: response.razorpay_order_id || orderData.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            throw new Error(verifyData.error || "Verification failed");
          }

          router.push(
            `/register/success?id=${registrationId}&reg=${verifyData.registrationNumber}`
          );
        } catch (verErr: any) {
          setError(verErr.message || "Payment verification failed. Please contact support.");
          setIsProcessing(false);
        }
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      console.warn("Razorpay modal error:", e);
      // Fallback
      handleSimulatePayment();
    }
  };

  // Development/Test Mode Payment Simulation
  const handleSimulatePayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      const fakePaymentId = `pay_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const fakeSignature = "simulated_valid_test_signature";

      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId,
          razorpayOrderId: orderData?.orderId || `order_sim_${Date.now()}`,
          razorpayPaymentId: fakePaymentId,
          razorpaySignature: fakeSignature,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Simulated payment verification failed");
      }

      router.push(`/register/success?id=${registrationId}&reg=${data.registrationNumber}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to simulate payment.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Back to Form link */}
      <button
        onClick={() => router.push("/register")}
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Registration Form</span>
      </button>

      {/* Main Payment Container */}
      <div className="rounded-2xl border border-slate-800 bg-[#0C1220]/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="text-center space-y-2 border-b border-slate-800/80 pb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-md">
            <CreditCard className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Complete Your Registration
          </h2>
          <p className="text-xs text-slate-400">
            Dharti Aaba Birsa Jayanti 2026 Ramp Walk Audition
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-xs text-red-300 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="h-6 w-6 animate-spin text-amber-500" />
            <p className="text-xs font-medium">Securing Razorpay Order...</p>
          </div>
        ) : (
          orderData && (
            <div className="space-y-6">
              {/* Participant Summary */}
              <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Participant:</span>
                  <span className="font-semibold text-white">{orderData.participant?.name}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Category:</span>
                  <span className="font-semibold text-amber-400">{orderData.participant?.category}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Contact:</span>
                  <span className="text-slate-300">{orderData.participant?.mobile}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Email:</span>
                  <span className="text-slate-300">{orderData.participant?.email}</span>
                </div>
              </div>

              {/* Total Fee Box */}
              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider block">
                    Total Amount Due
                  </span>
                  <span className="text-xs text-slate-400">Inclusive of all taxes & delegate pass</span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-amber-400">
                    {formatCurrency(EVENT_DETAILS.registrationFee)}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center justify-end gap-1 mt-0.5">
                    <CheckCircle2 className="h-3 w-3" /> Server Verified Fee
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={launchRazorpayCheckout}
                  className="btn-primary-gold w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold shadow-xl disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>Pay ₹{EVENT_DETAILS.registrationFee} via Razorpay</span>
                    </>
                  )}
                </button>

                {/* Local Dev / Test Mode Simulator */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    className="text-xs text-amber-400/80 hover:text-amber-300 underline font-medium"
                  >
                    ⚡ Test Mode: Simulate Instant Successful Payment
                  </button>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Use to complete end-to-end flow without requiring live gateway credentials.
                  </p>
                </div>
              </div>
            </div>
          )
        )}

        <div className="border-t border-slate-800/80 pt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Razorpay 256-bit Encrypted Checkout • UPI, Cards, NetBanking</span>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading Checkout...</div>}>
          <CheckoutContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
