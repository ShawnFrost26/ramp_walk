import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ArrowRight, LayoutDashboard, Lock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <Navbar />

      <main className="flex-1 bg-grid-pattern py-4 sm:py-10 px-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-start">
            
            {/* Left Column: Dharti Aaba Veer Birsa Munda Main Card */}
            <div className="lg:col-span-7 bg-white rounded-2xl border-t-4 border-[#900C22] border-x border-b border-rose-100/80 shadow-lg shadow-slate-200/50 p-4 sm:p-8 space-y-4 sm:space-y-6">
              
              {/* Anniversary Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FCECEF] border border-[#F8B4C0] px-3 py-0.5 text-[11px] sm:text-xs font-bold text-[#900C22]">
                <span>★</span>
                <span>151ST BIRTH ANNIVERSARY</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#900C22] tracking-tight leading-snug font-serif">
                DHARTI AABA VEER BIRSA MUNDA RAMP WALK 2026
              </h1>

              {/* Description Text */}
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  Tribal culture, heritage aur traditional pride ko promote karne ke liye is vishesh Ramp Walk Competition ka aayojan kiya ja raha hai.
                </p>
                <p>
                  Is platform ka maksad yuvaon aur karigaron ke dwara banaye gaye swadeshi attire, jewelry aur kala ko rashtriya sthar par samman dilana hai.
                </p>
              </div>

              {/* Mission Points Container */}
              <div className="rounded-xl border border-[#FCD5DC] bg-[#FFF5F6] p-3.5 sm:p-5 space-y-2 sm:space-y-3">
                <h2 className="text-xs sm:text-sm font-bold text-[#900C22]">
                  Mission Points:
                </h2>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#900C22] shrink-0 mt-1.5" />
                    <span>Traditional textile motifs aur handloom ko runway par dikhana.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#900C22] shrink-0 mt-1.5" />
                    <span>Modern Tribal Fusion ko promote karna.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#900C22] shrink-0 mt-1.5" />
                    <span>Digital check-in ke sath live judging aur verification.</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Right Column: 3 Action Cards with Compact Spacing */}
            <div className="lg:col-span-5 space-y-3 sm:space-y-5">
              
              {/* 1. NEW REGISTRATION CARD */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-2.5 sm:space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                    1. NEW REGISTRATION
                  </h3>
                  <span className="text-lg sm:text-xl">✍️</span>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  Traditional ya Fusion Ramp Walk ke liye naya registration form bharein.
                </p>
                <Link
                  href="/register"
                  className="w-full py-2.5 sm:py-3.5 px-4 rounded-lg bg-[#900C22] hover:bg-[#74091A] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
                >
                  <span>Start Registration</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* 2. DELEGATE LOGIN CARD */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-2.5 sm:space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                    2. DELEGATE LOGIN
                  </h3>
                  <span className="text-lg sm:text-xl">💳</span>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  Registration status dekhein aur event entry QR pass download karein.
                </p>
                <Link
                  href="/delegate/login"
                  className="w-full py-2.5 sm:py-3.5 px-4 rounded-lg bg-[#A26715] hover:bg-[#8B5711] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
                >
                  <span>Open Dashboard</span>
                  <LayoutDashboard className="h-4 w-4" />
                </Link>
              </div>

              {/* 3. ADMIN LOGIN CARD */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-2.5 sm:space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                    3. ADMIN LOGIN
                  </h3>
                  <span className="text-lg sm:text-xl">🛡️</span>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  Organizer access: Payment verify karein aur QR check-in track karein.
                </p>
                <Link
                  href="/admin/login"
                  className="w-full py-2.5 sm:py-3.5 px-4 rounded-lg bg-[#1E293B] hover:bg-[#0F172A] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
                >
                  <Lock className="h-4 w-4" />
                  <span>Admin Portal</span>
                </Link>
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
