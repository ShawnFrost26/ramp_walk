import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { EVENT_DETAILS, COMPETITION_CATEGORIES } from "@/lib/constants/event";
import {
  Sparkles,
  Calendar,
  Layers,
  Camera,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  LayoutDashboard,
  Lock,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <Navbar />

      <main className="flex-1 bg-grid-pattern">
        {/* HERO SECTION MATCHING ATTACHED SCREENSHOT */}
        <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Dharti Aaba Veer Birsa Munda Main Card */}
              <div className="lg:col-span-7 bg-white rounded-2xl border-t-4 border-[#900C22] border-x border-b border-rose-100/80 shadow-xl shadow-slate-200/60 p-6 sm:p-10 space-y-6">
                
                {/* Anniversary Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FCECEF] border border-[#F8B4C0] px-3.5 py-1 text-xs font-bold text-[#900C22]">
                  <span>★</span>
                  <span>151ST BIRTH ANNIVERSARY</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#900C22] tracking-tight leading-snug font-serif">
                  DHARTI AABA VEER BIRSA MUNDA RAMP WALK 2026
                </h1>

                {/* Description Text */}
                <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                  <p>
                    Tribal culture, heritage aur traditional pride ko promote karne ke liye is vishesh Ramp Walk Competition ka aayojan kiya ja raha hai.
                  </p>
                  <p>
                    Is platform ka maksad yuvaon aur karigaron ke dwara banaye gaye swadeshi attire, jewelry aur kala ko rashtriya sthar par samman dilana hai.
                  </p>
                </div>

                {/* Mission Points Container */}
                <div className="rounded-xl border border-[#FCD5DC] bg-[#FFF5F6] p-5 sm:p-6 space-y-3">
                  <h2 className="text-sm font-bold text-[#900C22]">
                    Mission Points:
                  </h2>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-start gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-[#900C22] shrink-0 mt-1.5" />
                      <span>Traditional textile motifs aur handloom ko runway par dikhana.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-[#900C22] shrink-0 mt-1.5" />
                      <span>Modern Tribal Fusion ko promote karna.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-[#900C22] shrink-0 mt-1.5" />
                      <span>Digital check-in ke sath live judging aur verification.</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* Right Column: 3 Action Cards matching screenshot */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 1. NEW REGISTRATION CARD */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-md shadow-slate-200/40 hover:shadow-lg transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      1. NEW REGISTRATION
                    </h3>
                    <span className="text-xl">✍️</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-normal">
                    Traditional ya Fusion Ramp Walk ke liye naya registration form bharein.
                  </p>
                  <Link
                    href="/register"
                    className="w-full py-3.5 px-4 rounded-lg bg-[#900C22] hover:bg-[#74091A] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                  >
                    <span>Start Registration</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* 2. DELEGATE LOGIN CARD */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-md shadow-slate-200/40 hover:shadow-lg transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      2. DELEGATE LOGIN
                    </h3>
                    <span className="text-xl">💳</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-normal">
                    Registration status dekhein aur event entry QR pass download karein.
                  </p>
                  <Link
                    href="/delegate/login"
                    className="w-full py-3.5 px-4 rounded-lg bg-[#A26715] hover:bg-[#8B5711] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                  >
                    <span>Open Dashboard</span>
                    <LayoutDashboard className="h-4 w-4" />
                  </Link>
                </div>

                {/* 3. ADMIN LOGIN CARD */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-md shadow-slate-200/40 hover:shadow-lg transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      3. ADMIN LOGIN
                    </h3>
                    <span className="text-xl">🛡️</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-normal">
                    Organizer access: Payment verify karein aur QR check-in track karein.
                  </p>
                  <Link
                    href="/admin/login"
                    className="w-full py-3.5 px-4 rounded-lg bg-[#1E293B] hover:bg-[#0F172A] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Admin Portal</span>
                  </Link>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* COMPETITION CATEGORIES SECTION (LIGHT THEME) */}
        <section className="py-16 bg-slate-50/70 border-t border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#900C22]">
                <Layers className="h-4 w-4" />
                <span>Categories</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Choose Your Runway Category
              </h2>
              <p className="text-sm text-slate-600">
                Participate individually or as a traditional duo. Showcase the vibrant handloom fabrics,
                silver jewelry, and heritage symbols of your community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {COMPETITION_CATEGORIES.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-6 hover:border-[#900C22]/50 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-slate-400">0{idx + 1}</span>
                      <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#900C22]">
                        {cat.gender === "MALE" ? "Men Only" : cat.gender === "FEMALE" ? "Women Only" : "All Genders"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#900C22] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {cat.subtitle}. Evaluated on traditional styling, stage presence, walk confidence, and cultural significance.
                    </p>
                  </div>

                  <div className="pt-5 border-t border-slate-100 mt-6 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Fee: <strong className="text-slate-900">₹{EVENT_DETAILS.registrationFee}</strong></span>
                    <Link
                      href={`/register?category=${cat.id}`}
                      className="text-xs font-bold text-[#900C22] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      Apply Now <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AUDITION PROCESS & ROUNDS */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#900C22]">
                <Calendar className="h-4 w-4" />
                <span>Audition Architecture</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Event Structure & Competition Rounds
              </h2>
              <p className="text-sm text-slate-600">
                From audition screening to the grand stage on Birsa Jayanti, every participant undergoes
                structured evaluation by eminent jury members.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3 shadow-sm">
                <div className="text-2xl font-black text-[#900C22]">Round 1</div>
                <h4 className="text-base font-bold text-slate-900">Registration & Audition</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Screening at Rourkela audition center. Verification of registration pass, walk preview, and bio-data review.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3 shadow-sm">
                <div className="text-2xl font-black text-[#900C22]">Round 2</div>
                <h4 className="text-base font-bold text-slate-900">Traditional Runway Walk</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Participants walk in authentic tribal attire, showcasing poise, footwork, traditional ornaments, and cultural pride.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3 shadow-sm">
                <div className="text-2xl font-black text-[#900C22]">Round 3</div>
                <h4 className="text-base font-bold text-slate-900">Q&A & Heritage Insight</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Brief interaction with jury regarding the significance of the represented tribe, attire elements, and youth leadership.
                </p>
              </div>

              <div className="rounded-xl border border-[#FCD5DC] bg-[#FFF5F6] p-6 space-y-3 shadow-sm">
                <div className="text-2xl font-black text-[#900C22]">Grand Finale</div>
                <h4 className="text-base font-bold text-[#900C22]">Birsa Jayanti 2026</h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  15 November 2026: Live gala event, celebrity guest honors, crowning of Miss & Mr Rourkela, and cash award ceremony.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GUIDELINES & CTA */}
        <section className="py-16 bg-slate-50/70 border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase text-[#900C22]">
                    <Camera className="h-4 w-4" />
                    <span>Registration Guidelines</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Ready to Apply? Here is What You Need
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-600 pt-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>One passport or portrait photo (Max 1 MB)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Active mobile number & email ID</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Details of tribal attire to be worn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Fixed registration fee of ₹{EVENT_DETAILS.registrationFee} via UPI / Card</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 text-center lg:text-right">
                  <Link
                    href="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#900C22] hover:bg-[#74091A] text-white px-8 py-4 text-base font-bold shadow-lg transition-all"
                  >
                    <span>Start Registration</span>
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
