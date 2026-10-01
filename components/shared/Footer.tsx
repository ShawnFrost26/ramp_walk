import Link from "next/link";
import { EVENT_DETAILS } from "@/lib/constants/event";

export function Footer() {
  return (
    <footer className="w-full bg-[#900C22] text-white py-6 border-t border-[#74091A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
        {/* Navigation links matching the screenshot */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-white/95">
          <Link href="/terms" className="hover:underline transition-all">
            Terms & Conditions
          </Link>
          <Link href="/privacy" className="hover:underline transition-all">
            Privacy Policy
          </Link>
          <Link href="/refund-policy" className="hover:underline transition-all">
            Refund & Cancellation
          </Link>
          <Link href="/contact" className="hover:underline transition-all">
            Contact Us
          </Link>
        </div>

        {/* Copyright notice matching screenshot */}
        <p className="text-[11px] sm:text-xs text-white/80">
          © {EVENT_DETAILS.year} Tribal Heritage Organizer. All Rights Reserved. Celebrating Dharti Aaba Veer Birsa Munda&apos;s 151st Jayanti.
        </p>
      </div>
    </footer>
  );
}
