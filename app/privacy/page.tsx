import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { EVENT_DETAILS } from "@/lib/constants/event";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Dharti Aaba Veer Birsa Munda Jayanti 2026",
  description: "Official Privacy Policy regarding participant data collection, storage, and security for the Dharti Aaba Veer Birsa Munda Jayanti 2026 Ramp Walk Competition.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="space-y-3 text-center sm:text-left border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Data Protection & Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Last updated: October 2026 • We respect and safeguard your personal information.
          </p>
        </div>

        <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-slate-300 space-y-6">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 font-mono">1.</span> Information We Collect
            </h2>
            <p>
              When you register for the <strong>Dharti Aaba Veer Birsa Munda Jayanti 2026 Ramp Walk</strong>, we collect personal and contact details necessary for audition scheduling and identity verification:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
              <li><strong>Personal Bio-Data:</strong> Full name, guardian name, date of birth, age, and gender.</li>
              <li><strong>Contact Information:</strong> Active mobile phone number, WhatsApp number, and email address.</li>
              <li><strong>Address & Location:</strong> Residential address, village/city, district, state, and PIN code.</li>
              <li><strong>Cultural & Attire Details:</strong> Community/tribe name, traditional attire representation, and talent introduction.</li>
              <li><strong>Photograph:</strong> Digital portrait uploaded for your Delegate Pass and organizer verification.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 font-mono">2.</span> How We Use Your Information
            </h2>
            <p>Your information is used strictly for the following purposes:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
              <li>Issuing your unique Registration Number and generating your official Delegate Pass.</li>
              <li>Verifying eligibility for competition categories (Miss & Mr Rourkela, Junior, Youth).</li>
              <li>Communicating audition dates, venue guidelines, and reporting timings via SMS or email.</li>
              <li>Jury evaluation rosters and certificate generation.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 font-mono">3.</span> Payment Data Security
            </h2>
            <p>
              All online registration transactions are handled by <strong>Razorpay</strong>, an authorized, RBI-compliant, PCI-DSS Level 1 certified payment gateway.
            </p>
            <p className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-emerald-200">
              <strong>Important Note:</strong> We do NOT collect, view, or store your credit/debit card numbers, CVV codes, net banking passwords, or UPI PINs on our servers. All sensitive financial transactions occur within Razorpay&apos;s encrypted checkout infrastructure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 font-mono">4.</span> Data Storage & Protection
            </h2>
            <p>
              Your data is stored in enterprise-grade PostgreSQL databases hosted by Supabase with Row Level Security (RLS) policies enabled. Delegate passes and photos are stored securely and accessed via cryptographic time-limited tokens.
            </p>
            <p>
              We do not sell, rent, or trade your personal data to any external commercial marketing agencies. Data is accessible solely to designated event committee members and technical administrators.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 font-mono">5.</span> Delegate Rights & Profile Access
            </h2>
            <p>
              You can access and review your complete registration record at any time by logging into the{" "}
              <a href="/delegate/login" className="text-amber-400 hover:underline font-semibold">
                Delegate Portal
              </a>{" "}
              using your Registration Number and registered mobile number.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-800/80 pt-6">
            <h2 className="text-base sm:text-lg font-bold text-white">Privacy Officer & Inquiries</h2>
            <p className="text-slate-400">
              For any questions regarding this Privacy Policy or your data, please contact:
              <br />
              <strong>Privacy Secretariat — {EVENT_DETAILS.name}</strong>
              <br />
              Email: <a href={`mailto:${EVENT_DETAILS.contact.email}`} className="text-amber-400 hover:underline">{EVENT_DETAILS.contact.email}</a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
