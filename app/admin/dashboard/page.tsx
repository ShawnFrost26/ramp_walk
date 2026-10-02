"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { COMPETITION_CATEGORIES, EVENT_DETAILS } from "@/lib/constants/event";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Shield,
  Users,
  CheckCircle2,
  Clock,
  IndianRupee,
  Search,
  FileSpreadsheet,
  Download,
  Eye,
  LogOut,
  RefreshCw,
  X,
  Activity,
  MessageSquare,
  Check,
  Tag,
  Phone,
  Mail,
  Edit,
  Crown,
  UserCheck,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
import { InspectDelegateModal } from "@/components/admin/InspectDelegateModal";
import {
  ResolveInquiryModal,
  InquiryRecord,
} from "@/components/admin/ResolveInquiryModal";
import { AdminAccessRequestsSection } from "@/components/admin/AdminAccessRequestsSection";

export default function AdminDashboardPage() {
  const router = useRouter();

  // Admin Session (Super Admin vs Sub Admin)
  const [adminSession, setAdminSession] = useState<{
    isSuperAdmin: boolean;
    role: string;
    username: string;
    name: string;
    email?: string;
  } | null>(null);

  // Metrics & State
  const [metrics, setMetrics] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 25, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Detailed Modal State
  const [inspectRecord, setInspectRecord] = useState<any | null>(null);

  // Sheets Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Active Main Tab: "participants" | "pending_delegates" | "inquiries" | "audit" | "admin_requests"
  const [activeTab, setActiveTab] = useState<"participants" | "pending_delegates" | "inquiries" | "audit" | "admin_requests">("participants");
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [pendingAdminCount, setPendingAdminCount] = useState(0);

  // Pending / Incomplete Delegates State
  const [pendingRegistrations, setPendingRegistrations] = useState<any[]>([]);
  const [isLoadingPending, setIsLoadingPending] = useState(false);
  const [pendingSearch, setPendingSearch] = useState("");
  const [pendingCategory, setPendingCategory] = useState("");

  // Inquiries Desk State
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [inquiryStats, setInquiryStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [inquirySearch, setInquirySearch] = useState("");
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState("ALL");
  const [selectedInquiryForResolution, setSelectedInquiryForResolution] = useState<InquiryRecord | null>(null);

  // 0. Fetch Pending Admin Access Requests Count (Super Admin only)
  const fetchAdminPendingCount = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/requests");
      if (res.ok) {
        const data = await res.json();
        setPendingAdminCount(data.stats?.pending || 0);
      }
    } catch (err) {
      console.warn("Could not fetch admin pending count:", err);
    }
  }, []);

  // 1. Fetch Aggregate Dashboard Metrics
  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setMetrics(data.metrics);
      if (data.adminSession) {
        setAdminSession(data.adminSession);
        if (data.adminSession.isSuperAdmin) {
          fetchAdminPendingCount();
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin metrics:", err);
    }
  }, [router, fetchAdminPendingCount]);

  // 2. Fetch Paginated Registrations
  const fetchRegistrations = useCallback(
    async (pageToLoad = 1, searchQuery = search) => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          page: pageToLoad.toString(),
          pageSize: "25",
          search: searchQuery,
          category: selectedCategory,
          status: selectedStatus,
        });

        const res = await fetch(`/api/admin/registrations?${params.toString()}`);
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }

        const data = await res.json();
        setRegistrations(data.registrations || []);
        setPagination(data.pagination || { page: 1, pageSize: 25, total: 0, totalPages: 1 });
      } catch (err) {
        console.error("Failed to load registrations:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [search, selectedCategory, selectedStatus, router]
  );

  // 2b. Fetch Pending & Incomplete Registrations
  const fetchPendingRegistrations = useCallback(
    async (query = pendingSearch, cat = pendingCategory) => {
      try {
        setIsLoadingPending(true);
        const params = new URLSearchParams({
          page: "1",
          pageSize: "50",
          search: query,
          category: cat,
          status: "PAYMENT_PENDING",
        });

        const res = await fetch(`/api/admin/registrations?${params.toString()}`);
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }

        const data = await res.json();
        setPendingRegistrations(data.registrations || []);
      } catch (err) {
        console.error("Failed to load pending registrations:", err);
      } finally {
        setIsLoadingPending(false);
      }
    },
    [pendingSearch, pendingCategory, router]
  );

  // 3. Fetch Audit Logs
  const fetchAuditLogs = async () => {
    try {
      const res = await fetch("/api/admin/audit-logs");
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    }
  };

  // 4. Fetch Inquiries List & Counters
  const fetchInquiries = useCallback(
    async (status = inquiryStatusFilter, query = inquirySearch) => {
      try {
        setIsLoadingInquiries(true);
        const params = new URLSearchParams({
          status: status || "ALL",
          search: query || "",
        });

        const res = await fetch(`/api/admin/inquiries?${params.toString()}`);
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }

        const data = await res.json();
        setInquiries(data.inquiries || []);
        if (data.stats) {
          setInquiryStats(data.stats);
        }
      } catch (err) {
        console.error("Failed to fetch inquiries:", err);
      } finally {
        setIsLoadingInquiries(false);
      }
    },
    [inquiryStatusFilter, inquirySearch, router]
  );

  useEffect(() => {
    fetchMetrics();
    fetchRegistrations(1);
    fetchPendingRegistrations();
    fetchInquiries("ALL", "");
  }, [fetchMetrics, fetchRegistrations, fetchPendingRegistrations, fetchInquiries]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegistrations(1);
  };

  const handleInquirySearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInquiries(inquiryStatusFilter, inquirySearch);
  };

  const handleJumpToParticipant = (term: string) => {
    setActiveTab("participants");
    setSearch(term);
    fetchRegistrations(1, term);
  };

  const handleSyncSheets = async () => {
    try {
      setIsSyncing(true);
      setSyncMessage(null);
      const res = await fetch("/api/admin/sheets/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      setSyncMessage(`Google Sheets synced successfully! ${data.syncedRows} records updated.`);
    } catch (err: any) {
      setSyncMessage(`Sync Warning: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 bg-grid-pattern">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-[#1E293B] border border-slate-200 shadow-sm">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">Event Administration Console</h1>
                {adminSession?.isSuperAdmin ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-[11px] font-black text-amber-900 shadow-sm">
                    <Crown className="h-3 w-3 text-amber-700" />
                    <span>Main Creator Admin (Master Access)</span>
                  </span>
                ) : adminSession ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-300 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 shadow-sm">
                    <UserCheck className="h-3 w-3 text-slate-600" />
                    <span>Secretariat Admin: {adminSession.name}</span>
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-slate-500">
                Dharti Aaba Birsa Jayanti 2026 Ramp Walk • Auditions, Delegates & Support Desk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSyncing}
              onClick={handleSyncSheets}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-all shadow-sm"
            >
              {isSyncing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-4 w-4" />
              )}
              <span>Sync Google Sheet</span>
            </button>

            <a
              href="/api/admin/sheets/sync"
              download
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {syncMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{syncMessage}</span>
            </div>
            <button onClick={() => setSyncMessage(null)} className="text-emerald-700 hover:text-emerald-950">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* PENDING ADMIN ACCESS REQUESTS ALERT BANNER */}
        {pendingAdminCount > 0 && adminSession?.isSuperAdmin && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                <Crown className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="font-bold text-sm text-amber-950">
                  {pendingAdminCount} Admin Access Request{pendingAdminCount > 1 ? "s" : ""} Pending Approval
                </p>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  Event officials have requested secretariat access. Review and approve or reject their requests.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("admin_requests")}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 shadow-sm transition-all text-xs"
            >
              <span>View & Approve Requests</span>
              <span>→</span>
            </button>
          </div>
        )}

        {/* METRICS CARDS */}
        {metrics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-1 shadow-sm">
              <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                <Users className="h-4 w-4 text-blue-600" />
                <span>Total Applications</span>
              </span>
              <div className="text-3xl font-black text-slate-900">{metrics.totalRegistrations}</div>
              <p className="text-[10px] text-slate-400">All draft & confirmed entries</p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 space-y-1 shadow-sm">
              <span className="text-xs text-emerald-800 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Confirmed Delegates</span>
              </span>
              <div className="text-3xl font-black text-emerald-700">{metrics.confirmedCount}</div>
              <p className="text-[10px] text-emerald-600">Verified payment completed</p>
            </div>

            <div
              onClick={() => {
                setActiveTab("pending_delegates");
                fetchPendingRegistrations();
              }}
              className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 space-y-1 shadow-sm cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group"
            >
              <span className="text-xs text-amber-800 flex items-center justify-between font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span>Pending Payment</span>
                </span>
                <span className="text-[10px] text-amber-700 underline group-hover:text-amber-900 font-bold">
                  View →
                </span>
              </span>
              <div className="text-3xl font-black text-amber-700">{metrics.pendingCount}</div>
              <p className="text-[10px] text-amber-600">Checkout in progress / draft</p>
            </div>

            <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-5 space-y-1 shadow-sm">
              <span className="text-xs text-[#900C22] flex items-center gap-1.5 font-medium">
                <IndianRupee className="h-4 w-4 text-[#900C22]" />
                <span>Collected Revenue</span>
              </span>
              <div className="text-3xl font-black text-[#900C22]">
                {formatCurrency(metrics.totalRevenue)}
              </div>
              <p className="text-[10px] text-slate-500">₹{EVENT_DETAILS.registrationFee} per delegate</p>
            </div>
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("participants")}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "participants"
                ? "bg-[#1E293B] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Participants List
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("pending_delegates");
              fetchPendingRegistrations();
            }}
            className={`relative rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "pending_delegates"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Pending & Incomplete</span>
            {metrics?.pendingCount > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  activeTab === "pending_delegates"
                    ? "bg-white text-amber-800"
                    : "bg-amber-500 text-white"
                }`}
              >
                {metrics.pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("inquiries");
              fetchInquiries();
            }}
            className={`relative rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "inquiries"
                ? "bg-[#900C22] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Delegate Inquiries</span>
            {inquiryStats.pending > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  activeTab === "inquiries"
                    ? "bg-white text-[#900C22]"
                    : "bg-amber-500 text-white"
                }`}
              >
                {inquiryStats.pending}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("audit");
              fetchAuditLogs();
            }}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "audit"
                ? "bg-[#1E293B] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Audit Log Trail
          </button>

          {/* Main Creator Admin Exclusive Tab */}
          {adminSession?.isSuperAdmin && (
            <button
              type="button"
              onClick={() => {
                setActiveTab("admin_requests");
                fetchAdminPendingCount();
              }}
              className={`relative rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === "admin_requests"
                  ? "bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Crown className="h-4 w-4 text-amber-400" />
              <span>Admin Access Requests</span>
              {pendingAdminCount > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                    activeTab === "admin_requests"
                      ? "bg-amber-400 text-slate-900"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  {pendingAdminCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* TAB 1: PARTICIPANTS DIRECTORY */}
        {activeTab === "participants" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-6">
            
            {/* Search & Filter Bar */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5 relative">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name, phone, email, or TH2026- number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1E293B]"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1E293B]"
                >
                  <option value="">All Categories</option>
                  {COMPETITION_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1E293B]"
                >
                  <option value="">All Statuses</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PAYMENT_PENDING">PAYMENT_PENDING</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="w-full rounded-xl py-2 text-xs font-bold bg-[#1E293B] hover:bg-[#0F172A] text-white shadow-md transition-all"
                >
                  Filter
                </button>
              </div>
            </form>

            {/* Directory Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Reg No</th>
                    <th className="py-3 px-4">Participant</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#900C22]" />
                        Loading participant records...
                      </td>
                    </tr>
                  ) : registrations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No registrations found matching your query.
                      </td>
                    </tr>
                  ) : (
                    registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#900C22]">
                          {reg.registration_number || "—"}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{reg.full_name}</div>
                          <div className="text-[11px] text-slate-400">
                            {reg.gender} • {reg.tribal_community || "Indigenous"}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{reg.category}</td>
                        <td className="py-3 px-4">
                          <div className="text-slate-900">{reg.mobile_number}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{reg.email}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {reg.city_or_village}, {reg.district}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              reg.registration_status === "CONFIRMED"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : reg.registration_status === "PAYMENT_PENDING"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {reg.registration_status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setInspectRecord(reg)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-[#1E293B] hover:text-[#1E293B] transition-colors shadow-sm"
                          >
                            <Eye className="h-3.5 w-3.5 text-[#1E293B]" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <div>
                Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages || 1}</strong> (Total {pagination.total} records)
              </div>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchRegistrations(pagination.page - 1)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-700 disabled:opacity-40 hover:bg-slate-50"
                >
                  Previous
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchRegistrations(pagination.page + 1)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-700 disabled:opacity-40 hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 1B: PENDING & INCOMPLETE REGISTRATIONS */}
        {activeTab === "pending_delegates" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <h2 className="text-lg font-black text-slate-900">
                    Pending & Incomplete Registrations
                  </h2>
                  <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold px-2.5 py-0.5">
                    {metrics?.pendingCount || pendingRegistrations.length} Incomplete
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Delegates who initiated registration but payment failed or was interrupted. Inspect their entered details, photograph, and assist them to complete confirmation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => fetchPendingRegistrations()}
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoadingPending ? "animate-spin" : ""}`} />
                <span>Refresh List</span>
              </button>
            </div>

            {/* Search & Filter Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchPendingRegistrations();
              }}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3"
            >
              <div className="sm:col-span-6 relative">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search pending name, phone, or email..."
                  value={pendingSearch}
                  onChange={(e) => setPendingSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={pendingCategory}
                  onChange={(e) => setPendingCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-600"
                >
                  <option value="">All Categories</option>
                  {COMPETITION_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full rounded-xl py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md transition-all"
                >
                  Filter
                </button>
              </div>
            </form>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Ref / Reg No</th>
                    <th className="py-3 px-4">Pending Delegate</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Contact Details</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoadingPending ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-amber-600" />
                        Loading pending delegates...
                      </td>
                    </tr>
                  ) : pendingRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                        <p className="font-semibold text-slate-700">No Pending Registrations Found</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          All applicants have either completed payment or there are no abandoned registrations at this time.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    pendingRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-amber-800">
                          {reg.registration_number || `PENDING-${reg.id.slice(0, 6)}`}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{reg.full_name}</div>
                          <div className="text-[11px] text-slate-400">
                            {reg.gender || "Delegate"} • DOB: {reg.date_of_birth || "—"}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-700">{reg.category}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 font-mono text-slate-700 font-semibold">
                            <span>{reg.mobile_number}</span>
                            <a
                              href={`https://wa.me/91${reg.mobile_number.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                                reg.full_name
                              )},%20we%20noticed%20your%20registration%20for%20Dharti%20Aaba%20Birsa%20Jayanti%202026%20Ramp%20Walk%20is%20incomplete/pending.%20Please%20let%20us%20know%20if%20you%20need%20assistance.`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 ml-1"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </a>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{reg.email}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {reg.city_or_village || reg.district ? `${reg.city_or_village || ""}, ${reg.district || ""}` : "—"}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                            <Clock className="h-3 w-3" />
                            <span>Payment Pending</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setInspectRecord(reg)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-amber-600 hover:text-amber-800 transition-colors shadow-sm"
                              title="Inspect what delegate registered and view photo"
                            >
                              <Eye className="h-3.5 w-3.5 text-amber-600" />
                              <span>View / Edit Details</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>
                💡 You can view all information submitted by the delegate (including uploaded photo, personal & cultural info).
              </span>
              <span>
                Click &quot;View / Edit Details&quot; to inspect or update their status to CONFIRMED.
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: INQUIRIES DESK & RESOLUTION SECTION */}
        {activeTab === "inquiries" && (
          <div className="space-y-6">
            {/* Quick Inquiries Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-1 shadow-sm">
                <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span>Total Inquiries Received</span>
                </span>
                <div className="text-3xl font-black text-slate-900">{inquiryStats.total}</div>
                <p className="text-[10px] text-slate-400">All submitted queries & corrections</p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 space-y-1 shadow-sm">
                <span className="text-xs text-amber-800 flex items-center gap-1.5 font-medium">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span>Pending / Action Required</span>
                </span>
                <div className="text-3xl font-black text-amber-700">{inquiryStats.pending}</div>
                <p className="text-[10px] text-amber-600">Spelling errors, pending payments</p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 space-y-1 shadow-sm">
                <span className="text-xs text-emerald-800 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Resolved Issues</span>
                </span>
                <div className="text-3xl font-black text-emerald-700">{inquiryStats.resolved}</div>
                <p className="text-[10px] text-emerald-600">Corrected & closed inquiries</p>
              </div>
            </div>

            {/* Inquiries Table Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-6">
              {/* Search & Filter Bar */}
              <form onSubmit={handleInquirySearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6 relative">
                  <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search delegate name, phone, ticket number, email..."
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#900C22]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={inquiryStatusFilter}
                    onChange={(e) => {
                      setInquiryStatusFilter(e.target.value);
                      fetchInquiries(e.target.value, inquirySearch);
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#900C22]"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>

                <div className="sm:col-span-3 flex gap-2">
                  <button
                    type="submit"
                    className="w-full rounded-xl py-2 text-xs font-bold bg-[#900C22] hover:bg-[#74091A] text-white shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>Search</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInquirySearch("");
                      setInquiryStatusFilter("ALL");
                      fetchInquiries("ALL", "");
                    }}
                    className="rounded-xl px-3 py-2 text-xs font-semibold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </form>

              {/* Inquiries Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Ticket</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Delegate</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Issue Description</th>
                      <th className="py-3 px-4">Resolution Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isLoadingInquiries ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#900C22]" />
                          Loading delegate inquiries...
                        </td>
                      </tr>
                    ) : inquiries.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          No inquiries found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      inquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#900C22]">
                            {inq.ticket_number || "INQ-PENDING"}
                          </td>
                          <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                            {formatDate(inq.created_at)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{inq.name}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2">
                              <span>{inq.phone}</span>
                              <span className="text-slate-300">•</span>
                              <span className="truncate max-w-[130px]">{inq.email}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block rounded-md bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px] font-semibold border border-slate-200 max-w-[180px] truncate">
                              {inq.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 max-w-xs">
                            <p className="line-clamp-2 text-slate-700 text-xs">
                              {inq.message}
                            </p>
                            {inq.admin_notes && (
                              <div className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1 inline-block truncate max-w-full">
                                <strong>Remark:</strong> {inq.admin_notes}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                inq.status === "RESOLVED"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : inq.status === "IN_PROGRESS"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {inq.status === "RESOLVED" ? (
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Clock className="h-3 w-3 text-amber-600" />
                              )}
                              <span>{inq.status}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedInquiryForResolution(inq)}
                              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all shadow-sm ${
                                inq.status === "RESOLVED"
                                  ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                  : "bg-[#900C22] hover:bg-[#74091A] text-white"
                              }`}
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span>{inq.status === "RESOLVED" ? "View / Edit" : "Resolve"}</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT LOGS */}
        {activeTab === "audit" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#900C22]" />
              <span>System & Operator Audit Trail</span>
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              {auditLogs.length === 0 ? (
                <p className="py-8 text-center text-slate-400">No audit logs recorded yet.</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="py-3 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="font-bold text-[#900C22]">{log.action}</span>
                      <p className="text-[11px] text-slate-500">
                        Actor: {log.actor_type} ({log.actor_identifier || "System Engine"})
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {formatDate(log.created_at)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ADMIN ACCESS REQUESTS & TEAM APPROVALS (MAIN CREATOR ADMIN ONLY) */}
        {activeTab === "admin_requests" && adminSession?.isSuperAdmin && (
          <AdminAccessRequestsSection onRefreshParent={fetchAdminPendingCount} />
        )}

      </main>

      {/* INSPECT PARTICIPANT MODAL (Full View & Admin Edit) */}
      {inspectRecord && (
        <InspectDelegateModal
          record={inspectRecord}
          onClose={() => setInspectRecord(null)}
          onRecordUpdated={(updated) => {
            setRegistrations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
            setPendingRegistrations((prev) =>
              updated.registration_status === "CONFIRMED"
                ? prev.filter((r) => r.id !== updated.id)
                : prev.map((r) => (r.id === updated.id ? updated : r))
            );
            fetchMetrics();
            fetchRegistrations(pagination.page);
            fetchPendingRegistrations();
          }}
        />
      )}

      {/* RESOLVE INQUIRY MODAL */}
      {selectedInquiryForResolution && (
        <ResolveInquiryModal
          inquiry={selectedInquiryForResolution}
          onClose={() => setSelectedInquiryForResolution(null)}
          onInquiryUpdated={(updated) => {
            setInquiries((prev) =>
              prev.map((i) => (i.id === updated.id ? updated : i))
            );
            fetchInquiries();
          }}
          onJumpToParticipant={handleJumpToParticipant}
        />
      )}

      <Footer />
    </div>
  );
}
