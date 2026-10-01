"use client";

import Link from "next/link";
import { Home, UserCheck, Shield, Sparkles } from "lucide-react";
import { EVENT_DETAILS } from "@/lib/constants/event";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#900C22] text-white shadow-md border-b border-[#74091A]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo matching image */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-400 via-rose-300 to-indigo-400 text-slate-900 font-black shadow group-hover:scale-105 transition-transform text-base">
            🏹
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black tracking-wider text-white uppercase font-sans">
              Tribal Heritage 2026
            </span>
          </div>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg bg-[#7A0A1D] border border-[#A81732] px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#670817] transition-all shadow-sm"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>

          <Link
            href="/delegate/login"
            className="hidden sm:flex items-center gap-1.5 rounded-lg bg-[#A26715] hover:bg-[#8B5711] text-white px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <UserCheck className="h-4 w-4" />
            <span>Delegate</span>
          </Link>

          <Link
            href="/admin/login"
            className="hidden md:flex items-center gap-1.5 rounded-lg bg-[#1E293B] hover:bg-[#0F172A] text-white px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <Shield className="h-4 w-4" />
            <span>Admin</span>
          </Link>

          <Link
            href="/register"
            className="flex items-center gap-1.5 rounded-lg bg-white text-[#900C22] hover:bg-rose-50 px-3.5 py-1.5 text-xs sm:text-sm font-bold shadow transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#900C22]" />
            <span>Register</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
