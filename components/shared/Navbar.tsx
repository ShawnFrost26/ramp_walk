"use client";

import Link from "next/link";
import { Sparkles, UserCheck, Shield, Award } from "lucide-react";
import { EVENT_DETAILS } from "@/lib/constants/event";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-500/20 bg-[#090D16]/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-bold shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
            <Award className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
              Dharti Aaba Birsa Jayanti
            </span>
            <span className="text-xs font-medium text-amber-400/90 tracking-wider uppercase">
              Ramp Walk 2026 • Miss & Mr Rourkela
            </span>
          </div>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/delegate/login"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-200 hover:border-amber-500/40 hover:bg-slate-800/80 transition-all"
          >
            <UserCheck className="h-4 w-4 text-amber-400" />
            <span>Delegate Login</span>
          </Link>

          <Link
            href="/admin/login"
            className="hidden md:flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
          >
            <Shield className="h-4 w-4" />
            <span>Admin</span>
          </Link>

          <Link
            href="/register"
            className="btn-primary-gold flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold shadow-md"
          >
            <Sparkles className="h-4 w-4" />
            <span>Register Now (₹{EVENT_DETAILS.registrationFee})</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
