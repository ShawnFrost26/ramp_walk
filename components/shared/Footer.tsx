import Link from "next/link";
import { EVENT_DETAILS } from "@/lib/constants/event";
import { Award, Mail, Phone, MapPin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-amber-500/15 bg-[#060910] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold">
                <Award className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                {EVENT_DETAILS.name}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-md">
              A grand commemorative cultural celebration honoring the legacy of Dharti Aaba Bhagwan Birsa Munda.
              Showcasing vibrant indigenous tribal attires, cultural traditions, modeling grace, and youth leadership.
            </p>
            <div className="pt-2 text-xs text-amber-400/80 font-medium">
              Official Audition Platform for Miss & Mr Rourkela 2026
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Quick Portals
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/register" className="hover:text-amber-400 transition-colors">
                  Registration Form
                </Link>
              </li>
              <li>
                <Link href="/delegate/login" className="hover:text-amber-400 transition-colors">
                  Delegate Pass & Login
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-amber-400 transition-colors">
                  Organizer Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Event Secretariat */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Event Secretariat
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-500 shrink-0" />
                <span>{EVENT_DETAILS.location}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                <span>{EVENT_DETAILS.contact.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-500 shrink-0" />
                <span>{EVENT_DETAILS.contact.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {EVENT_DETAILS.year} {EVENT_DETAILS.organizer}. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Preserving Heritage & Youth Empowerment</span>
            <Heart className="h-3.5 w-3.5 text-amber-500 inline fill-amber-500/20" />
          </div>
        </div>
      </div>
    </footer>
  );
}
