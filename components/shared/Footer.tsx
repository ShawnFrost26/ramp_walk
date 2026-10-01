import Link from "next/link";
import { EVENT_DETAILS } from "@/lib/constants/event";
import { Award, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-amber-500/15 bg-[#060910] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                {EVENT_DETAILS.name}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              A grand commemorative cultural celebration honoring the legacy of Dharti Aaba Bhagwan Birsa Munda.
              Showcasing vibrant indigenous tribal attires, cultural traditions, modeling grace, and youth leadership.
            </p>
            <div className="text-xs text-amber-400/90 font-medium">
              Official Audition Platform for Miss & Mr Rourkela 2026
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Event Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/register" className="hover:text-amber-400 transition-colors">
                  Participant Registration
                </Link>
              </li>
              <li>
                <Link href="/delegate/login" className="hover:text-amber-400 transition-colors">
                  Delegate Pass & Login
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-amber-400 transition-colors">
                  Organizer Admin Console
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  Helpdesk & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Payment Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Policies & Compliance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/terms" className="hover:text-amber-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-amber-400 transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Event Secretariat */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Event Secretariat
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{EVENT_DETAILS.location}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                <span>{EVENT_DETAILS.contact.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-500 shrink-0" />
                <a href={`mailto:${EVENT_DETAILS.contact.email}`} className="hover:text-amber-400 transition-colors">
                  {EVENT_DETAILS.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {EVENT_DETAILS.year} {EVENT_DETAILS.organizer}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-slate-400 transition-colors">Refund Policy</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
