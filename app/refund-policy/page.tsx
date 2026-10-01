import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { EVENT_DETAILS } from "@/lib/constants/event";
import { RefreshCcw } from "lucide-react";

export const metadata = {
  title: "Cancellation & Refund Policy | Dharti Aaba Veer Birsa Munda Jayanti 2026",
  description: "Official Cancellation and Refund Policy for the Dharti Aaba Veer Birsa Munda Jayanti 2026 Ramp Walk Competition.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8 bg-grid-pattern">
        <div className="space-y-3 text-center sm:text-left border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-semibold text-[#900C22]">
            <RefreshCcw className="h-3.5 w-3.5" />
            <span>Financial & Cancellation Guidelines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last updated: October 2026 • Clear guidelines on audition registration fees.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-6 text-xs sm:text-sm leading-relaxed text-slate-600">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-[#900C22] font-mono">1.</span> Non-Refundable Registration Fee
            </h2>
            <p>
              The <strong>₹{EVENT_DETAILS.registrationFee}</strong> registration fee for the{" "}
              <strong>Dharti Aaba Veer Birsa Munda Jayanti 2026 Ramp Walk Competition</strong> covers logistical arrangements, stage setup, jury evaluation, delegate pass generation, and administrative processing.
            </p>
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-[#900C22]">
              <strong>General Rule:</strong> Once a registration is confirmed and the Delegate Pass is issued, the registration fee is <strong>strictly non-refundable and non-transferable</strong> to another person or future edition.
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-[#900C22] font-mono">2.</span> Duplicate Transactions & Technical Glitches
            </h2>
            <p>
              In case of a banking error or network glitch where:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-500">
              <li>Your account was debited multiple times for a single registration, or</li>
              <li>Amount was deducted from your bank/UPI account but the portal failed to generate a Registration Number (order failed at gateway),</li>
            </ul>
            <p>
              The excess or failed transaction amount will be automatically reversed by the payment gateway or bank within <strong>5 to 7 business days</strong> to the original payment source.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-[#900C22] font-mono">3.</span> Event Postponement or Venue Change
            </h2>
            <p>
              If unavoidable administrative circumstances, weather disturbances, or government advisories necessitate rescheduling the audition or finale dates, registrations will remain fully valid for the revised dates.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-[#900C22] font-mono">4.</span> Refund Dispute Escalation
            </h2>
            <p>
              For payment queries or duplicate debit verifications, delegates may contact the secretariat helpdesk with the Razorpay Payment ID and bank transaction reference:
            </p>
            <p className="font-semibold text-slate-900">
              Email: <span className="text-[#900C22]">{EVENT_DETAILS.contact.email}</span> • Helpline: {EVENT_DETAILS.contact.phone}
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
