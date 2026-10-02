import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { updateInquiryStatus } from "@/lib/db/inquiries";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, admin_notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Inquiry ID is required" }, { status: 400 });
    }

    const validStatuses = ["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updated = await updateInquiryStatus(id, {
      status,
      admin_notes,
    });

    if (!updated) {
      return NextResponse.json({ error: "Inquiry not found or failed to update" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      inquiry: updated,
      message: `Inquiry successfully marked as ${status || updated.status}`,
    });
  } catch (error: any) {
    console.error("Admin inquiry patch error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update inquiry" },
      { status: 500 }
    );
  }
}
