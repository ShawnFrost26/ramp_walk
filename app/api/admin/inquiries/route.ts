import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { getAllInquiries } from "@/lib/db/inquiries";

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "ALL";
    const search = searchParams.get("search") || "";

    const { inquiries, stats } = await getAllInquiries({
      status,
      search,
    });

    return NextResponse.json({
      inquiries,
      stats,
    });
  } catch (error: any) {
    console.error("Admin inquiries GET error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load inquiries" },
      { status: 500 }
    );
  }
}
