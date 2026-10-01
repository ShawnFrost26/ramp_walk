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
  Filter,
  FileSpreadsheet,
  Download,
  Eye,
  LogOut,
  RefreshCw,
  X,
  AlertCircle,
  Activity,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();

  // Metrics & State
  const [metrics, setMetrics] = useState<any>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
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
      setCategoryCounts(data.categoryCounts || {});
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
      const data = await res.json();
      setAuditLogs(data.logs || []);
    } catch (err) {
      console.error("Failed to load audit logs:", err);
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
      setSyncMessage(data.message || `Successfully synced ${data.recordsSynced} records.`);
      fetchMetrics();
    } catch (err: any) {
      setSyncMessage(err.message || "Failed to trigger sheet sync.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-md">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Event Administration Console</h1>
              <p className="text-xs text-slate-400">
                Dharti Aaba Birsa Jayanti 2026 Ramp Walk • Auditions & Delegates Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSyncing}
              onClick={handleSyncSheets}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/60 transition-all"
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
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {syncMessage && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{syncMessage}</span>
            </div>
            <button onClick={() => setSyncMessage(null)} className="text-emerald-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* METRICS CARDS */}
        {metrics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-[#0C1220]/80 p-5 space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-blue-400" />
                <span>Total Applications</span>
              </span>
              <div className="text-3xl font-black text-white">{metrics.totalRegistrations}</div>
              <p className="text-[10px] text-slate-500">All draft & confirmed entries</p>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5 space-y-1">
              <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Confirmed Delegates</span>
              </span>
              <div className="text-3xl font-black text-emerald-400">{metrics.confirmedCount}</div>
              <p className="text-[10px] text-emerald-300/60">Verified payment completed</p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-5 space-y-1">
              <span className="text-xs text-amber-400 flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>Pending Payment</span>
              </span>
              <div className="text-3xl font-black text-amber-400">{metrics.pendingCount}</div>
              <p className="text-[10px] text-amber-300/60">Checkout in progress / draft</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0C1220]/80 p-5 space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <IndianRupee className="h-4 w-4 text-emerald-400" />
                <span>Collected Revenue</span>
              </span>
              <div className="text-3xl font-black text-amber-400">
                {formatCurrency(metrics.totalRevenue)}
              </div>
              <p className="text-[10px] text-slate-500">₹{EVENT_DETAILS.registrationFee} per delegate</p>
            </div>
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("participants")}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "participants"
                ? "bg-amber-500 text-slate-950"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
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
                ? "bg-amber-500 text-slate-950"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            Audit Log Trail
          </button>
        </div>

        {/* TAB 1: PARTICIPANTS DIRECTORY */}
        {activeTab === "participants" && (
          <div className="rounded-2xl border border-slate-800 bg-[#0C1220]/80 p-6 backdrop-blur-xl shadow-xl space-y-6">
            
            {/* Search & Filter Bar */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5 relative">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search name, phone, email, or TH26- number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
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
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
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
                  className="btn-primary-gold w-full rounded-xl py-2 text-xs font-bold shadow-md"
                >
                  Filter
                </button>
              </div>
            </form>

            {/* Directory Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
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
                <tbody className="divide-y divide-slate-800/60">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-amber-500" />
                        Loading participant records...
                      </td>
                    </tr>
                  ) : registrations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        No registrations found matching your query.
                      </td>
                    </tr>
                  ) : (
                    registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-amber-400">
                          {reg.registration_number || "—"}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{reg.full_name}</div>
                          <div className="text-[11px] text-slate-400">
                            {reg.gender} • {reg.tribal_community || "Indigenous"}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">{reg.category}</td>
                        <td className="py-3 px-4">
                          <div className="text-white">{reg.mobile_number}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{reg.email}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {reg.city_or_village}, {reg.district}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              reg.registration_status === "CONFIRMED"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : reg.registration_status === "PAYMENT_PENDING"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {reg.registration_status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setInspectRecord(reg)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:border-amber-500/50 hover:text-white transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5 text-amber-400" />
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
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <div>
                Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages || 1}</strong> (Total {pagination.total} records)
              </div>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchRegistrations(pagination.page - 1)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 disabled:opacity-30"
                >
                  Previous
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchRegistrations(pagination.page + 1)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: AUDIT LOGS */}
        {activeTab === "audit" && (
          <div className="rounded-2xl border border-slate-800 bg-[#0C1220]/80 p-6 backdrop-blur-xl shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-400" />
              <span>System & Operator Audit Trail</span>
            </h3>

            <div className="divide-y divide-slate-800 text-xs">
              {auditLogs.length === 0 ? (
                <p className="py-8 text-center text-slate-500">No audit logs recorded yet.</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="py-3 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="font-bold text-amber-400">{log.action}</span>
                      <p className="text-[11px] text-slate-400">
                        Actor: {log.actor_type} ({log.actor_identifier || "System Engine"})
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-3xl border border-amber-500/30 bg-[#0F172A] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                  {inspectRecord.registration_number || "Draft Entry"}
                </span>
                <h3 className="text-xl font-bold text-white">{inspectRecord.full_name}</h3>
              </div>
              <button
                onClick={() => setInspectRecord(null)}
                className="rounded-full bg-slate-800 p-1.5 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500">Category:</span>
                <p className="font-semibold text-amber-400 mt-0.5">{inspectRecord.category}</p>
              </div>
              <div>
                <span className="text-slate-500">Status:</span>
                <p className="font-semibold text-emerald-400 mt-0.5">{inspectRecord.registration_status}</p>
              </div>
              <div>
                <span className="text-slate-500">Contact:</span>
                <p className="text-white mt-0.5">{inspectRecord.mobile_number}</p>
                <p className="text-slate-400 truncate">{inspectRecord.email}</p>
              </div>
              <div>
                <span className="text-slate-500">Guardian & Community:</span>
                <p className="text-white mt-0.5">{inspectRecord.guardian_name}</p>
                <p className="text-amber-300">{inspectRecord.tribal_community || "Tribal"}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">Full Address:</span>
                <p className="text-slate-200 mt-0.5">{inspectRecord.full_address}</p>
                <p className="text-slate-400">
                  {inspectRecord.city_or_village}, {inspectRecord.district}, {inspectRecord.state} - {inspectRecord.pincode}
                </p>
              </div>
              {(inspectRecord.attire_name || inspectRecord.attire_representation) && (
                <div className="col-span-2 border-t border-slate-800 pt-3">
                  <span className="text-slate-500">Traditional Attire:</span>
                  <p className="font-semibold text-white mt-0.5">
                    {inspectRecord.attire_name} ({inspectRecord.attire_representation})
                  </p>
                  {inspectRecord.attire_description && (
                    <p className="text-slate-400 text-[11px] mt-1 italic">&ldquo;{inspectRecord.attire_description}&rdquo;</p>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectRecord(null)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2 text-xs font-semibold text-slate-200 hover:text-white"
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
