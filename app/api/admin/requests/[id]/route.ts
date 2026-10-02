import { NextRequest, NextResponse } from "next/server";
import { isSuperAdminAuthenticated } from "@/lib/auth/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  updateAdminUserStatus,
  deleteAdminUserRecord,
  countActiveAdmins,
} from "@/lib/db/adminUsers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSuperAdminAuthenticated(req)) {
      return NextResponse.json(
        { error: "Access denied. Only the Main Creator Admin can approve or revoke admin accounts." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { status, admin_notes } = body;

    const validStatuses = ["APPROVED", "DISAPPROVED", "REVOKED", "PENDING"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // If approving, check 20 admin limit
    if (status === "APPROVED") {
      const { approved } = await countActiveAdmins();
      if (approved >= 20) {
        return NextResponse.json(
          { error: "Maximum limit of 20 approved admins has already been reached." },
          { status: 400 }
        );
      }
    }

    const updated = await updateAdminUserStatus(id, status, admin_notes);
    if (!updated) {
      return NextResponse.json({ error: "Admin request not found" }, { status: 404 });
    }

    // Write audit log
    try {
      const supabase = getSupabaseServerClient();
      await supabase.from("audit_logs").insert({
        action: `ADMIN_ACCESS_${status}`,
        actor_type: "ADMIN",
        actor_identifier: "Main Creator Admin",
        metadata: {
          admin_user_id: id,
          username: updated.name,
          email: updated.email,
          new_status: status,
          admin_notes,
        },
      });
    } catch (auditErr) {
      console.warn("Audit log creation skipped:", auditErr);
    }

    return NextResponse.json({
      success: true,
      user: updated,
      message:
        status === "APPROVED"
          ? `Admin access approved for ${updated.name}. They can now log in using their Name & Email.`
          : `Admin access for ${updated.name} has been set to ${status}.`,
    });
  } catch (error: any) {
    console.error("Admin request patch error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update admin request" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSuperAdminAuthenticated(req)) {
      return NextResponse.json(
        { error: "Access denied. Only the Main Creator Admin can delete admin accounts." },
        { status: 403 }
      );
    }

    const { id } = await params;
    await deleteAdminUserRecord(id);

    return NextResponse.json({ success: true, message: "Admin account deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete admin account" },
      { status: 500 }
    );
  }
}
