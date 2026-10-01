import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();
    const { data: logs, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error && error.code !== "PGRST116") {
      console.warn("Audit logs query warning:", error.message);
    }

    return NextResponse.json({ logs: logs || [] });
  } catch (error: any) {
    console.error("Admin audit logs error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load audit logs" },
      { status: 500 }
    );
  }
}
