import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";

    const supabase = getSupabaseServerClient();

    let query = supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && status !== "ALL") {
      query = query.eq("status", status);
    }

    if (search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(
        `name.ilike.${term},phone.ilike.${term},email.ilike.${term},ticket_number.ilike.${term},message.ilike.${term}`
      );
    }

    const { data: inquiries, error } = await query;

    if (error && error.code !== "PGRST116") {
      console.warn("Inquiries fetch warning:", error.message);
    }

    const records = inquiries || [];

    // Calculate quick counts
    const total = records.length;
    const pending = records.filter((i) => i.status === "PENDING" || i.status === "IN_PROGRESS").length;
    const resolved = records.filter((i) => i.status === "RESOLVED").length;

    return NextResponse.json({
      inquiries: records,
      stats: {
        total,
        pending,
        resolved,
      },
    });
  } catch (error: any) {
    console.error("Admin inquiries GET error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load inquiries" },
      { status: 500 }
    );
  }
}
