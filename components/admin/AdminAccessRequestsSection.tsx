"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  UserCheck,
  UserX,
  Trash2,
  Clock,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  Search,
  Mail,
  Phone,
  User,
  Users,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface AdminRequestRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "SUPER_ADMIN" | "SUB_ADMIN";
  status: "PENDING" | "APPROVED" | "DISAPPROVED" | "REVOKED";
  requested_at: string;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  admin_notes?: string | null;
  created_at: string;
}

export function AdminAccessRequestsSection({
  onRefreshParent,
}: {
  onRefreshParent?: () => void;
}) {
  const [requests, setRequests] = useState<AdminRequestRecord[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    disapproved: 0,
    maxLimit: 20,
    remainingSlots: 20,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/requests");
      if (!res.ok) {
        throw new Error("Failed to load admin access requests");
      }
      const data = await res.json();
      setRequests(data.requests || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      console.error(err);
      setFeedbackMessage({ type: "error", text: err.message || "Failed to load requests" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleUpdateStatus = async (
    id: string,
    newStatus: "APPROVED" | "DISAPPROVED" | "REVOKED",
    personName: string
  ) => {
    try {
      setActionInProgress(id);
      setFeedbackMessage(null);

      const res = await fetch(`/api/admin/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update admin status");
      }

      setFeedbackMessage({
        type: "success",
        text:
          newStatus === "APPROVED"
            ? `Admin access approved for ${personName}! They can now log in using their Name as Username and Email as Secret Key.`
            : `Admin access for ${personName} has been revoked / disapproved.`,
      });

      fetchRequests();
      if (onRefreshParent) onRefreshParent();
    } catch (err: any) {
      setFeedbackMessage({ type: "error", text: err.message || "Operation failed" });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDeleteRequest = async (id: string, personName: string) => {
    if (!confirm(`Are you sure you want to permanently delete the admin record for "${personName}"?`)) {
      return;
    }

    try {
      setActionInProgress(id);
      const res = await fetch(`/api/admin/requests/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      setFeedbackMessage({
        type: "success",
        text: `Admin access record for ${personName} deleted permanently.`,
      });
      fetchRequests();
      if (onRefreshParent) onRefreshParent();
    } catch (err: any) {
      setFeedbackMessage({ type: "error", text: err.message || "Failed to delete" });
    } finally {
      setActionInProgress(null);
    }
  };

  const filteredList = requests.filter((r) => {
    const matchesFilter = filterStatus === "ALL" || r.status === filterStatus;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-6">
      {/* Top Banner / Stats */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-slate-900" />
            <h2 className="text-lg font-black text-slate-900">
              Admin Access Requests & Team Approvals
            </h2>
            <span className="rounded-full bg-slate-900 text-white text-[11px] font-bold px-2.5 py-0.5">
              Creator Master Console
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review and grant operational admin access to authorized secretariat members (Maximum 20 members capacity).
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchRequests()}
          className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Requests</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Requests</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">{stats.total}</span>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
          <span className="text-[11px] font-semibold text-emerald-700 block">Approved Admins</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-emerald-900">{stats.approved}</span>
            <span className="text-xs text-emerald-600 font-semibold">/ {stats.maxLimit} max</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
          <span className="text-[11px] font-semibold text-amber-700 block">Awaiting Approval</span>
          <span className="text-2xl font-black text-amber-900 mt-0.5 block">{stats.pending}</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
          <span className="text-[11px] font-semibold text-slate-500 block">Available Slots</span>
          <span className="text-2xl font-black text-slate-700 mt-0.5 block">
            {stats.remainingSlots} left
          </span>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackMessage && (
        <div
          className={`rounded-xl p-3.5 text-xs flex items-center justify-between ${
            feedbackMessage.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1E293B]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "PENDING", "APPROVED", "DISAPPROVED"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                filterStatus === st
                  ? "bg-[#1E293B] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {st === "ALL" ? "All Requests" : st === "PENDING" ? `Pending (${stats.pending})` : st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Requester Name & Login Username</th>
              <th className="px-4 py-3">Email ID (Secret Key)</th>
              <th className="px-4 py-3">Mobile Number</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Requested At</th>
              <th className="px-4 py-3 text-right">Master Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />
                    <span>Loading admin access requests...</span>
                  </div>
                </td>
              </tr>
            ) : filteredList.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  <UserX className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-600">No admin requests found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    When event officials click &quot;Sign Up for Access&quot; on the login page, their requests will appear here.
                  </p>
                </td>
              </tr>
            ) : (
              filteredList.map((req) => {
                const isPending = req.status === "PENDING";
                const isApproved = req.status === "APPROVED";
                const isBusy = actionInProgress === req.id;

                return (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                          {req.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{req.name}</span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Lock className="h-2.5 w-2.5" />
                            Username: <strong>{req.name}</strong> (exact case)
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-[11px]">{req.email}</span>
                      </div>
                      <span className="text-[10px] text-emerald-600">Used as Secret Key</span>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{req.phone}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                          <Check className="h-3 w-3" />
                          <span>Approved</span>
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                          <Clock className="h-3 w-3" />
                          <span>Pending Approval</span>
                        </span>
                      )}
                      {(req.status === "DISAPPROVED" || req.status === "REVOKED") && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
                          <X className="h-3 w-3" />
                          <span>{req.status === "REVOKED" ? "Access Revoked" : "Disapproved"}</span>
                        </span>
                      )}
                    </td>

                    {/* Requested At */}
                    <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                      {req.requested_at ? formatDate(req.requested_at) : "Recent"}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Approve Button */}
                        {!isApproved && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleUpdateStatus(req.id, "APPROVED", req.name)}
                            className="flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 text-[11px] font-bold transition-all shadow-sm disabled:opacity-50"
                            title="Approve admin access for this member"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            <span>Approve</span>
                          </button>
                        )}

                        {/* Disapprove / Revoke Button */}
                        {isApproved && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleUpdateStatus(req.id, "REVOKED", req.name)}
                            className="flex items-center gap-1 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1.5 text-[11px] font-bold transition-all disabled:opacity-50"
                            title="Disapprove / Revoke admin access immediately"
                          >
                            <UserX className="h-3.5 w-3.5" />
                            <span>Revoke Access</span>
                          </button>
                        )}

                        {/* Disapprove for Pending */}
                        {isPending && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleUpdateStatus(req.id, "DISAPPROVED", req.name)}
                            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 px-2 py-1.5 text-[11px] font-semibold transition-all disabled:opacity-50"
                            title="Disapprove this request"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Reject</span>
                          </button>
                        )}

                        {/* Delete permanently */}
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleDeleteRequest(req.id, req.name)}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete record permanently"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>
          💡 Only the Main Creator Admin can view this section and approve or revoke accounts.
        </span>
        <span>Maximum 20 members limit enforced.</span>
      </div>
    </div>
  );
}
