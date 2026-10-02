"use client";

import { useState } from "react";
import {
  X,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  AlertCircle,
  Save,
  Check,
  User,
  Tag,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface InquiryRecord {
  id: string;
  ticket_number?: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  message: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  admin_notes?: string | null;
  resolved_by?: string | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface ResolveInquiryModalProps {
  inquiry: InquiryRecord;
  onClose: () => void;
  onInquiryUpdated: (updated: InquiryRecord) => void;
  onJumpToParticipant?: (phoneOrName: string) => void;
}

export function ResolveInquiryModal({
  inquiry,
  onClose,
  onInquiryUpdated,
  onJumpToParticipant,
}: ResolveInquiryModalProps) {
  const [status, setStatus] = useState<"PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED">(
    inquiry.status || "PENDING"
  );
  const [adminNotes, setAdminNotes] = useState(inquiry.admin_notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSaveResolution = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          admin_notes: adminNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update inquiry resolution");
      }

      setSuccessMessage(
        status === "RESOLVED"
          ? "Inquiry marked as RESOLVED successfully!"
          : `Inquiry status updated to ${status}`
      );
      onInquiryUpdated(data.inquiry);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || "An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const isResolved = status === "RESOLVED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-[#900C22] border border-rose-200 shadow-sm">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  Delegate Inquiry Resolution
                </h3>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                  {inquiry.ticket_number || "TICKET"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Submitted on {formatDate(inquiry.created_at)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Delegate Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <User className="h-3 w-3" /> Delegate Name
              </span>
              <p className="text-sm font-bold text-slate-900">{inquiry.name}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Tag className="h-3 w-3" /> Issue Category
              </span>
              <p className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 inline-block">
                {inquiry.category}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Phone className="h-3 w-3" /> Mobile Number
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{inquiry.phone}</span>
                <a
                  href={`tel:${inquiry.phone}`}
                  className="text-[10px] bg-white border border-slate-300 hover:border-slate-500 px-2 py-0.5 rounded font-medium text-slate-700"
                >
                  Call
                </a>
                <a
                  href={`https://wa.me/91${inquiry.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 px-2 py-0.5 rounded font-medium text-emerald-700"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email Address
              </span>
              <div className="flex items-center gap-2 truncate">
                <a
                  href={`mailto:${inquiry.email}`}
                  className="text-xs font-medium text-blue-600 hover:underline truncate"
                >
                  {inquiry.email}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Jump to Participant in Database */}
          {onJumpToParticipant && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 flex items-center justify-between text-xs text-blue-900">
              <div className="space-y-0.5">
                <strong className="font-bold">Participant Bio-Data or Payment Correction?</strong>
                <p className="text-[11px] text-blue-800">
                  Search <strong>{inquiry.phone}</strong> in the Participants tab to edit spelling or confirm pending payment.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onJumpToParticipant(inquiry.phone);
                  onClose();
                }}
                className="shrink-0 inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg shadow-sm"
              >
                <span>Find Delegate</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Delegate Query Box */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Delegate's Query / Issue Description:
            </label>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-mono">
              {inquiry.message}
            </div>
          </div>

          {/* Resolution Form */}
          <form onSubmit={handleSaveResolution} className="space-y-4 pt-2 border-t border-slate-100">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Resolution Status *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("PENDING")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    status === "PENDING"
                      ? "bg-amber-100 text-amber-900 border-amber-400 ring-2 ring-amber-300"
                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  <span>PENDING</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus("IN_PROGRESS")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-900 border-blue-400 ring-2 ring-blue-300"
                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Clock className="h-3.5 w-3.5 text-blue-600" />
                  <span>IN PROGRESS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus("RESOLVED")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    status === "RESOLVED"
                      ? "bg-emerald-100 text-emerald-900 border-emerald-400 ring-2 ring-emerald-300"
                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>RESOLVED</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Admin Resolution Remarks & Actions Taken:
              </label>
              <textarea
                rows={3}
                placeholder="E.g., Corrected spelling error in full name from 'Ramesh' to 'Remis', updated district, and confirmed payment status on console..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#900C22]"
              />
              <p className="text-[11px] text-slate-400">
                These notes will be permanently attached to the resolution log and audit trail.
              </p>
            </div>

            {inquiry.resolved_at && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-[11px] text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>
                  Previously resolved on {formatDate(inquiry.resolved_at)} by{" "}
                  <strong>{inquiry.resolved_by || "Admin Secretariat"}</strong>
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className={`flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold text-white shadow-md transition-all ${
                  isResolved
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-[#1E293B] hover:bg-[#0F172A]"
                } disabled:opacity-50`}
              >
                {isSaving ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : isResolved ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Save & Mark Resolved</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Update Resolution Status</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
