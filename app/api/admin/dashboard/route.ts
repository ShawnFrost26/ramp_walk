import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { EVENT_DETAILS } from "@/lib/constants/event";

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();

    // 1. Query all registrations for aggregated stats
    const { data: registrations, error } = await supabase
      .from("registrations")
      .select("id, registration_number, full_name, mobile_number, email, category, registration_status, created_at, confirmed_at")
      .order("created_at", { ascending: false });

    if (error && error.code !== "PGRST116") {
      console.warn("Supabase query warning:", error.message);
    }

    const records = registrations || [];

    const totalRegistrations = records.length;
    const confirmedCount = records.filter((r) => r.registration_status === "CONFIRMED").length;
    const pendingCount = records.filter((r) => r.registration_status === "PAYMENT_PENDING" || r.registration_status === "DRAFT").length;
    const cancelledCount = records.filter((r) => r.registration_status === "CANCELLED").length;
    const totalRevenue = confirmedCount * EVENT_DETAILS.registrationFee;

    // Category breakdown
    const categoryCounts: Record<string, number> = {};
    records.forEach((r) => {
      const cat = r.category || "Unassigned";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // Check Sheet sync jobs pending
    const { data: syncJobs } = await supabase
      .from("sheet_sync_jobs")
      .select("id, status")
      .eq("status", "PENDING");

    return NextResponse.json({
      metrics: {
        totalRegistrations,
        confirmedCount,
        pendingCount,
        cancelledCount,
        totalRevenue,
        pendingSheetSyncs: syncJobs?.length || 0,
      },
      categoryCounts,
      recentRegistrations: records.slice(0, 10),
    });
  } catch (error: any) {
    console.error("Admin dashboard data fetch error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load dashboard metrics" },
      { status: 500 }
    );
  }
}
