import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

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

    const supabase = getSupabaseServerClient();

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updatePayload.status = status;
      if (status === "RESOLVED") {
        updatePayload.resolved_at = new Date().toISOString();
        updatePayload.resolved_by = "Admin Secretariat";
      } else {
        updatePayload.resolved_at = null;
        updatePayload.resolved_by = null;
      }
    }

    if (admin_notes !== undefined) {
      updatePayload.admin_notes = admin_notes;
    }

    const { data: updated, error } = await supabase
      .from("inquiries")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update inquiry:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Write to audit trail
    try {
      await supabase.from("audit_logs").insert({
        action: status === "RESOLVED" ? "INQUIRY_RESOLVED" : "INQUIRY_STATUS_UPDATED",
        actor_type: "ADMIN",
        actor_identifier: "Secretariat Desk",
        metadata: {
          inquiry_id: id,
          ticket_number: updated?.ticket_number,
          new_status: status,
          admin_notes,
        },
      });
    } catch (auditErr) {
      console.warn("Audit log creation skipped:", auditErr);
    }

    return NextResponse.json({
      success: true,
      inquiry: updated,
      message: `Inquiry successfully marked as ${status}`,
    });
  } catch (error: any) {
    console.error("Admin inquiry patch error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update inquiry" },
      { status: 500 }
    );
  }
}
