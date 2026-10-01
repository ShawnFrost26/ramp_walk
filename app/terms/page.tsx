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
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="space-y-3 text-center sm:text-left border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
            <FileText className="h-3.5 w-3.5" />
            <span>Official Policy Document • Version 1.0</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Terms & Conditions of Participation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Last updated: October 2026 • Applicable to all participants and delegates.
          </p>
        </div>

        <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-slate-300 space-y-6">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 font-mono">1.</span> Introduction & Eligibility
            </h2>
            <p>
              The <strong>Dharti Aaba Veer Birsa Munda Jayanti 2026 Ramp Walk Competition</strong> (including the Miss & Mr Rourkela 2026 Auditions) is an indigenous cultural modeling and heritage showcase organized by the Birsa Munda Jayanti Committee in Rourkela, Sundargarh, Odisha.
            </p>
            <p>
              Participation is open to eligible individuals who register through this official portal. By submitting a registration and paying the requisite fee, the participant agrees to abide strictly by these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 font-mono">2.</span> Registration & Audition Fee
            </h2>
            <p>
              A fixed, non-transferable audition registration fee of <strong>₹{EVENT_DETAILS.registrationFee}</strong> is payable at the time of online entry.
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
              <li>Registrations are confirmed only upon verified receipt of payment through the official payment gateway.</li>
              <li>A unique Registration Number (format: <code>TH26-XXXXXX</code>) is issued to every confirmed delegate.</li>
              <li>No participant will be allowed into the audition premises without a verified Delegate Pass or valid Registration Number.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 font-mono">3.</span> Traditional Attire & Cultural Representation
            </h2>
            <p>
              As this competition is dedicated to celebrating the pride, handloom heritage, and culture of indigenous tribal communities:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
              <li>Participants are required to wear authentic tribal traditional attires (e.g. Santhal, Munda, Oraon, Ho, Kharia, or other indigenous handloom weaves and ornaments).</li>
              <li>Any attire deemed disrespectful, offensive, or inappropriate to tribal culture will lead to disqualification at the sole discretion of the jury.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 font-mono">4.</span> Jury Decisions & Code of Conduct
            </h2>
            <p>
              The evaluation by the appointed jury panel across all rounds (traditional walk, presentation, Q&A, and finals) is final, authoritative, and binding. No disputes or appeals regarding jury scores will be entertained.
            </p>
            <p>
              Participants must conduct themselves with dignity, respect, and mutual sportsmanship. Misconduct, substance abuse, violence, or defamation on social media will result in immediate disqualification and forfeiture of delegate rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 font-mono">5.</span> Media, Photography & Broadcast Consent
            </h2>
            <p>
              By registering, the participant grants the organizers irrevocable, non-exclusive rights to photograph, video-record, broadcast, and publish their audition and runway performances across official social media, television, print, and event promotional archives without monetary compensation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 font-mono">6.</span> Event Schedule Alterations
            </h2>
            <p>
              The organizers reserve the right to modify the schedule, venue timings, or round sequences in case of unforeseen circumstances, weather conditions, or official administrative guidelines. Any changes will be updated on the portal and communicated via registered contacts.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-800/80 pt-6">
            <h2 className="text-base sm:text-lg font-bold text-white">Contact & Inquiries</h2>
            <p className="text-slate-400">
              For any clarification regarding these terms, please contact:
              <br />
              <strong>{EVENT_DETAILS.organizer}</strong>
              <br />
              Email: <a href={`mailto:${EVENT_DETAILS.contact.email}`} className="text-amber-400 hover:underline">{EVENT_DETAILS.contact.email}</a>
              <br />
              Phone: {EVENT_DETAILS.contact.phone}
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
