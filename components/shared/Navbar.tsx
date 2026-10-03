"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  UserCheck,
  Shield,
  Sparkles,
  Menu,
  X,
  Phone,
  FileText,
  Lock,
  ChevronRight,
} from "lucide-react";
import { EVENT_DETAILS } from "@/lib/constants/event";

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [drawerOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#900C22] text-white shadow-md border-b border-[#74091A] print:hidden no-print">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Brand / Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center shrink-0 rounded-full bg-amber-400/15 p-0.5 ring-1 ring-amber-400/30 shadow-sm group-hover:scale-105 transition-transform">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/tribal-logo.png"
                alt="Tribal Heritage Bow and Arrow"
                className="h-full w-full object-contain rounded-full drop-shadow-sm"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-lg font-black tracking-wider text-white uppercase font-sans">
                Tribal Heritage 2026
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg bg-[#7A0A1D] border border-[#A81732] px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#670817] transition-all shadow-sm"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            <Link
              href="/delegate/login"
              className="flex items-center gap-1.5 rounded-lg bg-[#A26715] hover:bg-[#8B5711] text-white px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all shadow-sm"
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

          {/* Mobile Right: Register quick button + Drawer Hamburger toggle */}
          <div className="flex sm:hidden items-center gap-1.5">
            <Link
              href="/register"
              className="flex items-center gap-1 rounded-lg bg-white text-[#900C22] px-2.5 py-1 text-xs font-bold shadow"
            >
              <Sparkles className="h-3 w-3 text-[#900C22]" />
              <span>Register</span>
            </Link>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="p-1.5 rounded-lg bg-[#7A0A1D] text-white hover:bg-[#670817] transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE APP DRAWER OVERLAY */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="relative w-4/5 max-w-xs h-full bg-white text-slate-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 bg-[#900C22] text-white flex items-center justify-between border-b border-[#74091A]">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-7 w-7 items-center justify-center shrink-0 rounded-full bg-amber-400/20 p-0.5 ring-1 ring-amber-400/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/tribal-logo.png"
                    alt="Tribal Heritage Bow and Arrow"
                    className="h-full w-full object-contain rounded-full"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-wider">Tribal Heritage</span>
                  <span className="text-[10px] text-white/80">Ramp Walk 2026</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-[#7A0A1D] hover:bg-[#670817] text-white transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3">
                  Main Portals
                </span>

                <Link
                  href="/"
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    pathname === "/"
                      ? "bg-rose-50 text-[#900C22]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Home className="h-4 w-4 text-[#900C22]" />
                    <span>Home Page</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>

                <Link
                  href="/register"
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    pathname === "/register"
                      ? "bg-rose-50 text-[#900C22]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="h-4 w-4 text-[#900C22]" />
                    <span>New Registration (₹{EVENT_DETAILS.registrationFee})</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>

                <Link
                  href="/delegate/login"
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    pathname.startsWith("/delegate")
                      ? "bg-amber-50 text-[#A26715]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="h-4 w-4 text-[#A26715]" />
                    <span>Delegate Pass & Login</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>

                <Link
                  href="/admin/login"
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    pathname.startsWith("/admin")
                      ? "bg-slate-100 text-[#1E293B]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="h-4 w-4 text-[#1E293B]" />
                    <span>Admin Portal</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3">
                  Support & Policies
                </span>

                <Link
                  href="/contact"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>Contact & Helpline</span>
                  </div>
                </Link>

                <Link
                  href="/terms"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                    <span>Terms & Conditions</span>
                  </div>
                </Link>

                <Link
                  href="/privacy"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Privacy Policy</span>
                  </div>
                </Link>

                <Link
                  href="/refund-policy"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                    <span>Refund Policy</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
              <p className="text-[10px] text-slate-400 font-medium">
                © {EVENT_DETAILS.year} Tribal Heritage Organizer
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
