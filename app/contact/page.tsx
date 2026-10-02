"use client";

import { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { EVENT_DETAILS } from "@/lib/constants/event";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    ticketNumber: string;
    emailDelivered: boolean;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Spelling Mistake / Bio-Data Correction",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry. Please try again.");
      }

      setSubmittedData({
        ticketNumber: data.ticketNumber || "INQ-PENDING",
        emailDelivered: Boolean(data.emailDelivered),
      });
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please contact via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-10 bg-grid-pattern">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-semibold text-[#900C22]">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Event Secretariat Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Contact & Delegate Support Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Need corrections in your delegate bio-data, spelling fixes, payment resolution, or audition support? Submit your inquiry below for direct secretariat assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="md:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Official Secretariat</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Active Desk
              </span>
            </h3>

            <div className="space-y-5 text-xs sm:text-sm text-slate-700">
              {/* Event Venue & Address */}
              <div className="flex items-start gap-3.5 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-[#900C22] border border-rose-100 shadow-sm shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <strong className="text-slate-900 block font-bold text-sm">Event Venue & Address</strong>
                  <p className="text-slate-800 text-xs font-semibold">Sector-13, Ground</p>
                  <p className="text-slate-500 text-xs">Rourkela, Near airport</p>
                </div>
              </div>

              {/* Helpline Numbers & WhatsApp */}
              <div className="flex items-start gap-3.5 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-[#A26715] border border-amber-100 shadow-sm shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <strong className="text-slate-900 block font-bold text-sm">Helpline Numbers</strong>
                  <a
                    href="tel:8917598855"
                    className="text-slate-800 hover:text-[#900C22] text-xs font-semibold block transition-colors"
                  >
                    8917598855
                  </a>
                  <a
                    href={`https://wa.me/91${EVENT_DETAILS.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors mt-0.5"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                    <span>WhatsApp: {EVENT_DETAILS.contact.whatsapp}</span>
                  </a>
                </div>
              </div>

              {/* Email Inquiries */}
              <div className="flex items-start gap-3.5 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-[#900C22] border border-rose-100 shadow-sm shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <strong className="text-slate-900 block font-bold text-sm">Direct Secretariat Email</strong>
                  <a
                    href={`mailto:${EVENT_DETAILS.email}`}
                    className="text-[#900C22] font-semibold text-xs hover:underline block break-all"
                  >
                    {EVENT_DETAILS.email}
                  </a>
                  <p className="text-[11px] text-slate-400">All submitted inquiries are delivered directly to this mailbox.</p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3.5 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200 shadow-sm shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <strong className="text-slate-900 block font-bold text-sm">Operating Hours</strong>
                  <p className="text-slate-700 text-xs font-semibold">
                    Monday to Saturday: 10:30 AM – 05:30 PM IST
                  </p>
                  <p className="text-slate-400 text-[11px]">Closed on National Holidays</p>
                </div>
              </div>
            </div>

            {/* Quick Tip Box */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1 text-amber-950">
                <HelpCircle className="h-3.5 w-3.5 text-amber-700" />
                Spelling or Payment Correction?
              </span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                If you made a spelling error during registration or your payment was deducted but marked pending, please mention your <strong>Mobile Number</strong> and <strong>Registration Number (TH2026-XXXX)</strong> below. The Admin will verify and resolve it directly from the console.
              </p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="md:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl">
            {submittedData ? (
              <div className="py-10 text-center space-y-5">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                
                <div className="space-y-1.5">
                  <h4 className="text-2xl font-black text-slate-900">Inquiry Submitted!</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Your request has been routed to the secretariat team and is now visible on the Admin Resolution Dashboard.
                  </p>
                </div>

                <div className="max-w-xs mx-auto rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-left">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Tracking Ticket:</span>
                    <span className="font-mono font-bold text-[#900C22] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {submittedData.ticketNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Recipient Mailbox:</span>
                    <span className="font-semibold text-slate-800 text-[11px]">{EVENT_DETAILS.email}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Admin Status:</span>
                    <span className="text-amber-700 font-bold text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      PENDING RESOLUTION
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href={`mailto:${EVENT_DETAILS.email}?subject=Inquiry [${submittedData.ticketNumber}] - ${encodeURIComponent(formData.name)}&body=Tracking Ticket: ${submittedData.ticketNumber}%0D%0AName: ${encodeURIComponent(formData.name)}%0D%0APhone: ${encodeURIComponent(formData.phone)}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(formData.message)}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
                  >
                    <Mail className="h-4 w-4 text-[#900C22]" />
                    <span>Open in Email App</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedData(null);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        category: "Spelling Mistake / Bio-Data Correction",
                        message: "",
                      });
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E293B] hover:bg-[#0F172A] px-4 py-2.5 text-xs font-semibold text-white shadow-sm"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Submit Another Inquiry</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">
                    Submit Inquiry / Request Correction
                  </h3>
                  <span className="text-[11px] text-slate-400">* Required fields</span>
                </div>

                {errorMessage && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Inquiry Type / Correction Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#900C22] font-medium"
                  >
                    <option value="Spelling Mistake / Bio-Data Correction">
                      Spelling Mistake / Bio-Data Correction
                    </option>
                    <option value="Payment Pending / Deducted but Unconfirmed">
                      Payment Pending / Deducted but Unconfirmed
                    </option>
                    <option value="Photo Upload / Document Re-submission">
                      Photo Upload / Document Re-submission
                    </option>
                    <option value="Audition Schedule & Venue Query">
                      Audition Schedule & Venue Query
                    </option>
                    <option value="Delegate Login & ID Card Issue">
                      Delegate Login & ID Card Issue
                    </option>
                    <option value="General Inquiry / Other">
                      General Inquiry / Other
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Delegate Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Munda"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#900C22]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, "") })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#900C22]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#900C22]"
                  />
                  <p className="text-[11px] text-slate-400">
                    A copy of the inquiry and response will be addressed here.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Your Issue / Query Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your issue in detail (e.g. 'My name was spelled Ramesh Munda instead of Remis Munda', or 'My payment of ₹500 was deducted on Razorpay but status shows pending, transaction ID: pay_xxx'...)"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#900C22]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold bg-[#900C22] hover:bg-[#74091A] text-white shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Submitting to Secretariat Mailbox...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Inquiry to veerbirsamunda5@gmail.com</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
