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
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();

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

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<"participants" | "audit">("participants");
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

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
    } catch (err) {
      console.error("Failed to fetch admin metrics:", err);
    }
  }, [router]);

  // 2. Fetch Paginated Registrations
  const fetchRegistrations = useCallback(
    async (pageToLoad = 1) => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          page: pageToLoad.toString(),
          pageSize: "25",
          search,
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

  useEffect(() => {
    fetchMetrics();
    fetchRegistrations(1);
  }, [fetchMetrics, fetchRegistrations]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegistrations(1);
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
              <h1 className="text-2xl font-black text-slate-900">Event Administration Console</h1>
              <p className="text-xs text-slate-500">
                Dharti Aaba Birsa Jayanti 2026 Ramp Walk • Auditions & Delegates Management
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

            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 space-y-1 shadow-sm">
              <span className="text-xs text-amber-800 flex items-center gap-1.5 font-medium">
                <Clock className="h-4 w-4 text-amber-600" />
                <span>Pending Payment</span>
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
        <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("participants")}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
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
                  placeholder="Search name, phone, email, or TH26- number..."
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

        {/* TAB 2: AUDIT LOGS */}
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

      </main>

      {/* INSPECT PARTICIPANT MODAL */}
      {inspectRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#900C22] uppercase tracking-widest font-bold">
                  {inspectRecord.registration_number || "Draft Entry"}
                </span>
                <h3 className="text-xl font-bold text-slate-900">{inspectRecord.full_name}</h3>
              </div>
              <button
                onClick={() => setInspectRecord(null)}
                className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:text-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Category:</span>
                <p className="font-semibold text-[#900C22] mt-0.5">{inspectRecord.category}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Status:</span>
                <p className="font-semibold text-emerald-700 mt-0.5">{inspectRecord.registration_status}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Contact:</span>
                <p className="text-slate-800 mt-0.5">{inspectRecord.mobile_number}</p>
                <p className="text-slate-500 truncate">{inspectRecord.email}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Guardian & Community:</span>
                <p className="text-slate-800 mt-0.5">{inspectRecord.guardian_name}</p>
                <p className="text-[#900C22] font-semibold">{inspectRecord.tribal_community || "Tribal"}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 font-medium">Full Address:</span>
                <p className="text-slate-700 mt-0.5">{inspectRecord.full_address}</p>
                <p className="text-slate-500">
                  {inspectRecord.city_or_village}, {inspectRecord.district}, {inspectRecord.state} - {inspectRecord.pincode}
                </p>
              </div>
              {(inspectRecord.attire_name || inspectRecord.attire_representation) && (
                <div className="col-span-2 border-t border-slate-100 pt-3">
                  <span className="text-slate-400 font-medium">Traditional Attire:</span>
                  <p className="font-semibold text-slate-900 mt-0.5">
                    {inspectRecord.attire_name} ({inspectRecord.attire_representation})
                  </p>
                  {inspectRecord.attire_description && (
                    <p className="text-slate-500 text-[11px] mt-1 italic">&ldquo;{inspectRecord.attire_description}&rdquo;</p>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectRecord(null)}
                className="rounded-xl border border-slate-300 bg-slate-100 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
