import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { EVENT_DETAILS } from "@/lib/constants/event";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Dharti Aaba Veer Birsa Munda Jayanti 2026",
  description: "Official Terms and Conditions for participation in the Dharti Aaba Veer Birsa Munda Jayanti 2026 Ramp Walk Competition.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8 bg-grid-pattern">
        <div className="space-y-3 text-center sm:text-left border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-semibold text-[#900C22]">
            <FileText className="h-3.5 w-3.5" />
            <span>Official Policy Document • Version 1.0</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms & Conditions of Participation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last updated: October 2026 • Applicable to all participants and delegates.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-6 text-xs sm:text-sm leading-relaxed text-slate-600">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-[#900C22] font-mono">1.</span> Introduction & Eligibility
            </h2>
            <p>
              The <strong>Dharti Aaba Veer Birsa Munda Jayanti 2026 Ramp Walk Competition</strong> (including the Miss & Mr Rourkela 2026 Auditions) is an indigenous cultural modeling and heritage showcase organized by the Birsa Munda Jayanti Committee in Rourkela, Sundargarh, Odisha.
            </p>
            <p>
              Participation is open to eligible individuals who register through this official portal. By submitting a registration and paying the requisite fee, the participant agrees to abide strictly by these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-[#900C22] font-mono">2.</span> Registration & Audition Fee
            </h2>
            <p>
              A fixed, non-transferable audition registration fee of <strong>₹{EVENT_DETAILS.registrationFee}</strong> is payable at the time of online entry.
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-500">
              <li>Registrations are confirmed only upon verified receipt of payment through the official payment gateway.</li>
              <li>A unique Registration Number (format: <code className="bg-rose-50 text-[#900C22] px-1 rounded font-mono text-xs">TH26-XXXXXX</code>) is issued to every confirmed delegate.</li>
              <li>No participant will be allowed into the audition premises without a verified Delegate Pass or valid Registration Number.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-[#900C22] font-mono">3.</span> Traditional Attire & Cultural Representation
            </h2>
            <p>
              Participants are encouraged to wear authentic traditional handlooms, hand-spun fabrics, indigenous jewelry, and cultural ornaments representing Santhal, Munda, Oraon, Ho, Kharia, or other indigenous communities.
            </p>
            <p>
              Attires must uphold modesty, decency, and respect toward tribal heritage and traditions. Indecent or disrespectful representations may lead to immediate disqualification by the jury panel.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-[#900C22] font-mono">4.</span> Jury Decision & Awards
            </h2>
            <p>
              All competition rounds are evaluated objectively by an independent panel of choreographers, fashion experts, and tribal cultural scholars. The jury&apos;s evaluation criteria encompass poise, posture, authentic styling, cultural insight, and runway presentation.
            </p>
            <p>
              The decision of the jury is final, binding, and not subject to appeal, dispute, or external arbitration.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-[#900C22] font-mono">5.</span> Media Rights & Broadcast Consent
            </h2>
            <p>
              By participating, delegates grant the organizing committee royalty-free rights to photograph, videotape, and broadcast their stage walks, interviews, and award ceremonies for cultural archival, news reports, documentary broadcasts, and promotional content.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
