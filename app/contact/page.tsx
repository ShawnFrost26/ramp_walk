"use client";

import { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { EVENT_DETAILS } from "@/lib/constants/event";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
            Contact & Support Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Need assistance with registration, payment verification, or audition schedules? Our committee secretariat is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="md:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Official Secretariat
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
                    href="https://wa.me/918917598855"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors mt-0.5"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                    <span>WhatsApp: 8917598855</span>
                  </a>
                </div>
              </div>

              {/* Email Inquiries */}
              <div className="flex items-start gap-3.5 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-[#900C22] border border-rose-100 shadow-sm shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <strong className="text-slate-900 block font-bold text-sm">Email Inquiries</strong>
                  <a
                    href="mailto:veerbirsamunda5@gmail.com"
                    className="text-[#900C22] font-semibold text-xs hover:underline block break-all"
                  >
                    veerbirsamunda5@gmail.com
                  </a>
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
          </div>

          {/* Inquiry Form */}
          <div className="md:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Message Received!</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Thank you for reaching out. An event coordinator will respond to your query within 24 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Send an Inquiry
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Your Name *</label>
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
                      placeholder="10-digit mobile"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Your Message / Query *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ask about registration, auditions, categories, or payment verification..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#900C22]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold bg-[#900C22] hover:bg-[#74091A] text-white shadow-md transition-all"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Inquiry</span>
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
