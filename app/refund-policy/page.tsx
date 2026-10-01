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
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="space-y-3 text-center sm:text-left border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
            <RefreshCcw className="h-3.5 w-3.5" />
            <span>Financial & Cancellation Guidelines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Last updated: October 2026 • Clear guidelines on audition registration fees.
          </p>
        </div>

        <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-slate-300 space-y-6">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 font-mono">1.</span> Non-Refundable Registration Fee
            </h2>
            <p>
              The <strong>₹{EVENT_DETAILS.registrationFee}</strong> registration fee for the{" "}
              <strong>Dharti Aaba Veer Birsa Munda Jayanti 2026 Ramp Walk Competition</strong> covers logistical arrangements, stage setup, jury evaluation, delegate pass generation, and administrative processing.
            </p>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">
              <strong>General Rule:</strong> Once a registration is confirmed and the Delegate Pass is issued, the registration fee is <strong>strictly non-refundable and non-transferable</strong> to another person or future edition.
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 font-mono">2.</span> Duplicate Transactions & Technical Glitches
            </h2>
            <p>
              In case of a banking error or network glitch where:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
              <li>Your account was debited multiple times for a single registration, or</li>
              <li>Amount was deducted from your bank/UPI account but the portal failed to generate a Registration Number (order failed at gateway),</li>
            </ul>
            <p>
              The excess or failed transaction amount will be automatically reversed by the payment gateway or bank within <strong>5 to 7 business days</strong> to the original payment source.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 font-mono">3.</span> Event Cancellation by Organizers
            </h2>
            <p>
              If the entire event or auditions are cancelled permanently by the organizers due to unforeseen administrative reasons or force majeure (without rescheduling), registered delegates will be entitled to a 100% refund of the paid registration fee.
            </p>
            <p className="text-slate-400">
              If an audition round is rescheduled to a new date or venue in Rourkela, existing registrations will remain valid and will not be eligible for a refund.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 font-mono">4.</span> Absenteeism & Disqualification
            </h2>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
              <li>Participants who fail to report at their assigned audition time will be marked as absent, and no refund will be issued.</li>
              <li>Participants disqualified due to breach of the code of conduct, submission of fraudulent information, or inappropriate attire will forfeit their entry fee.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-slate-800/80 pt-6">
            <h2 className="text-base sm:text-lg font-bold text-white">How to Claim a Duplicate Debit Refund</h2>
            <p className="text-slate-400">
              If you experience a duplicate deduction, please send an email with your payment details:
              <br />
              <strong>Email:</strong>{" "}
              <a href={`mailto:${EVENT_DETAILS.contact.email}`} className="text-amber-400 hover:underline">
                {EVENT_DETAILS.contact.email}
              </a>
              <br />
              <strong>Subject:</strong> Refund Request - [Your Mobile Number] - [Razorpay Payment ID]
              <br />
              <strong>Helpline:</strong> {EVENT_DETAILS.contact.phone}
            </p>
            <p className="text-slate-400 text-xs mt-2">
              Our accounts team will verify the payment log against our Razorpay dashboard and initiate the reversal within 48 business hours.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
