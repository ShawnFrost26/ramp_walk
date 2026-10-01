import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { EVENT_DETAILS, COMPETITION_CATEGORIES } from "@/lib/constants/event";
import {
  Sparkles,
  Award,
  Calendar,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Users,
  ChevronRight,
  Flame,
  Camera,
  Layers,
  Crown,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-amber-500/15">
          {/* Subtle Ambient Glow Backgrounds */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-emerald-600/5 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />
          <div className="absolute top-40 -right-20 w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Hero Text */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-amber-300">
                  <Flame className="h-4 w-4 text-amber-400 animate-pulse" />
                  <span>Honoring Dharti Aaba Bhagwan Birsa Munda</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                  Tribal Elegance Meets Modern Runway:{" "}
                  <span className="text-gold-gradient block mt-2">
                    Ramp Walk 2026
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  Step onto the state&apos;s grandest cultural stage. Compete for the prestigious crowns of{" "}
                  <strong className="text-amber-400">Mr & Miss Rourkela 2026</strong> and showcase authentic
                  traditional tribal attire, heritage pride, and runway charisma.
                </p>

                {/* Key Metric Highlights */}
                <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-center sm:text-left">
                    <div className="text-xs text-slate-400">Auditions</div>
                    <div className="text-sm font-bold text-amber-400 mt-0.5">{EVENT_DETAILS.dates.audition}</div>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-center sm:text-left">
                    <div className="text-xs text-slate-400">Grand Finale</div>
                    <div className="text-sm font-bold text-amber-400 mt-0.5">15 Nov 2026</div>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-center sm:text-left">
                    <div className="text-xs text-slate-400">Entry Fee</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">₹{EVENT_DETAILS.registrationFee} Fixed</div>
                  </div>
                </div>

                {/* CTA Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <Link
                    href="/register"
                    className="btn-primary-gold w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl px-7 py-3.5 text-base font-semibold shadow-xl"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>Register as Participant</span>
                  </Link>

                  <Link
                    href="/delegate/login"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-amber-400 hover:bg-slate-800 hover:border-amber-400 transition-all"
                  >
                    <span>Already Registered? Delegate Login</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-2">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    Secure Razorpay Checkout
                  </span>
                  <span>•</span>
                  <span>Instant Digital Pass with QR</span>
                  <span>•</span>
                  <span>No Registration Limit</span>
                </div>
              </div>

              {/* Right Column: Cultural Highlight Card */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md rounded-2xl border border-amber-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                  {/* Decorative Badge */}
                  <div className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-1 text-xs font-bold text-slate-950 shadow-md flex items-center gap-1">
                    <Crown className="h-3.5 w-3.5" />
                    <span>State Cultural Audition</span>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Award className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Miss & Mr Rourkela 2026</h3>
                        <p className="text-xs text-amber-400/90">Official Birsa Jayanti Audition</p>
                      </div>
                    </div>

                    <div className="space-y-3 border-t border-slate-800 pt-4 text-sm text-slate-300">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>Celebration of Santhal, Munda, Oraon, Ho, Kharia and all indigenous tribal attires.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>Professional runway choreography & jury panel of renowned fashion experts.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>Exciting cash prizes, crowns, trophies, portfolio shoot & title winner sashes.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>Official Delegate Identity Card with verifiable QR code generated post-payment.</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 flex items-center justify-between text-xs text-emerald-300">
                      <span className="font-medium">Registration Status</span>
                      <span className="flex items-center gap-1.5 font-bold">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        ONLINE & ACCEPTING
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* COMPETITION CATEGORIES SECTION */}
        <section className="py-20 bg-[#060911] border-b border-slate-800/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <Layers className="h-4 w-4" />
                <span>Categories</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Choose Your Runway Category
              </h2>
              <p className="text-sm sm:text-base text-slate-400">
                Participate individually or as a traditional duo. Showcase the vibrant handloom fabrics,
                silver jewelry, and heritage symbols of your community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {COMPETITION_CATEGORIES.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="group relative rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-amber-500/40 hover:bg-slate-900/80 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-slate-500">0{idx + 1}</span>
                      <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-300">
                        {cat.gender === "MALE" ? "Men Only" : cat.gender === "FEMALE" ? "Women Only" : "All Genders"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {cat.subtitle}. Evaluated on traditional styling, stage presence, walk confidence, and cultural significance.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-800/60 mt-6 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Fee: <strong className="text-white">₹500</strong></span>
                    <Link
                      href={`/register?category=${cat.id}`}
                      className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
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
        <section className="py-20 border-b border-slate-800/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <Calendar className="h-4 w-4" />
                <span>Audition Architecture</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Event Structure & Competition Rounds
              </h2>
              <p className="text-sm sm:text-base text-slate-400">
                From audition screening to the grand stage on Birsa Jayanti, every participant undergoes
                structured evaluation by eminent jury members.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 space-y-3">
                <div className="text-2xl font-black text-amber-500">Round 1</div>
                <h4 className="text-base font-bold text-white">Registration & Audition</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Screening at Rourkela audition center. Verification of registration pass, walk preview, and bio-data review.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 space-y-3">
                <div className="text-2xl font-black text-amber-500">Round 2</div>
                <h4 className="text-base font-bold text-white">Traditional Runway Walk</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Participants walk in authentic tribal attire, showcasing poise, footwork, traditional ornaments, and cultural pride.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 space-y-3">
                <div className="text-2xl font-black text-amber-500">Round 3</div>
                <h4 className="text-base font-bold text-white">Q&A & Heritage Insight</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Brief interaction with jury regarding the significance of the represented tribe, attire elements, and youth leadership.
                </p>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-6 space-y-3">
                <div className="text-2xl font-black text-amber-400">Grand Finale</div>
                <h4 className="text-base font-bold text-amber-300">Birsa Jayanti 2026</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  15 November 2026: Live gala event, celebrity guest honors, crowning of Miss & Mr Rourkela, and cash award ceremony.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PHOTO & REGISTRATION GUIDELINES */}
        <section className="py-16 bg-[#060911] border-b border-slate-800/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-amber-500/20 bg-slate-900/60 p-6 sm:p-10 backdrop-blur-md">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-amber-400">
                    <Camera className="h-4 w-4" />
                    <span>Registration Guidelines</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    Ready to Apply? Here is What You Need
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300 pt-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>One passport or portrait photo (Max 1 MB)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Active mobile number & email ID</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Details of tribal attire to be worn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Fixed registration fee of ₹500 via UPI / Card</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 text-center lg:text-right">
                  <Link
                    href="/register"
                    className="btn-primary-gold inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-bold shadow-xl"
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
