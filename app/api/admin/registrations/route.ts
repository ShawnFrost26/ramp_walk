import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "25", 10);
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";

    const supabase = getSupabaseServerClient();

    let query = supabase.from("registrations").select("*", { count: "exact" });

    // Category filter
    if (category) {
      query = query.eq("category", category);
    }

    // Status filter
    if (status) {
      query = query.eq("registration_status", status);
    }

    // Search filter
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,mobile_number.ilike.%${search}%,email.ilike.%${search}%,registration_number.ilike.%${search}%`
      );
    }

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: registrations, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error && error.code !== "PGRST116") {
      console.warn("Supabase registrations query warning:", error.message);
    }

    const total = count || registrations?.length || 0;
    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      registrations: registrations || [],
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error("Admin registrations search error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to search registrations" },
      { status: 500 }
    );
  }
}
