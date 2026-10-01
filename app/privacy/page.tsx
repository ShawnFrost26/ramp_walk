import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Dharti Aaba Veer Birsa Munda Jayanti 2026",
  description: "Official Privacy Policy regarding participant data collection, storage, and security for the Dharti Aaba Veer Birsa Munda Jayanti 2026 Ramp Walk Competition.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8 bg-grid-pattern">
        <div className="space-y-3 text-center sm:text-left border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-semibold text-[#900C22]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Data Protection & Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last updated: October 2026 • We respect and safeguard your personal information.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-6 text-xs sm:text-sm leading-relaxed text-slate-600">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-[#900C22] font-mono">1.</span> Information We Collect
            </h2>
            <p>
              When you register for the <strong>Dharti Aaba Veer Birsa Munda Jayanti 2026 Ramp Walk</strong>, we collect personal and contact details necessary for audition scheduling and identity verification:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-500">
              <li><strong>Personal Bio-Data:</strong> Full name, guardian name, date of birth, age, and gender.</li>
              <li><strong>Contact Information:</strong> Active mobile phone number, WhatsApp number, and email address.</li>
              <li><strong>Address & Location:</strong> Residential address, village/city, district, state, and PIN code.</li>
              <li><strong>Cultural & Attire Details:</strong> Community/tribe name, traditional attire representation, and talent introduction.</li>
              <li><strong>Photograph:</strong> Digital portrait uploaded for your Delegate Pass and organizer verification.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-[#900C22] font-mono">2.</span> How We Use Your Information
            </h2>
            <p>Your information is used strictly for the following purposes:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-500">
              <li>Issuing your unique Registration Number and generating your official Delegate Pass.</li>
              <li>Verifying eligibility for competition categories (Miss & Mr Rourkela, Junior, Youth).</li>
              <li>Communicating audition dates, venue guidelines, and reporting timings via SMS or email.</li>
              <li>Jury evaluation rosters and certificate generation.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-[#900C22] font-mono">3.</span> Data Protection & Payment Security
            </h2>
            <p>
              All online fee transactions are handled directly through <strong>Razorpay Payment Gateway</strong> using industry-standard 256-bit TLS encryption. 
              Our web platform does <strong>not</strong> collect, process, or store credit/debit card numbers, CVVs, or UPI MPINs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-[#900C22] font-mono">4.</span> Non-Disclosure Policy
            </h2>
            <p>
              The organizing committee does not sell, rent, or trade participant personal data to third-party marketing companies. 
              Information is accessed exclusively by certified event coordinators, jury administrators, and IT managers.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
