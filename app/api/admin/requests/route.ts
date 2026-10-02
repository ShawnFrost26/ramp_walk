import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSuperAdminAuthenticated } from "@/lib/auth/admin";
import {
  getAllAdminUsers,
  findAdminUserByEmail,
  countActiveAdmins,
  createAdminUserRecord,
} from "@/lib/db/adminUsers";

const adminSignUpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().toLowerCase().email("Please provide a valid email address"),
  phone: z.string().trim().regex(/^[0-9]{10}$/, "Phone must be a valid 10-digit mobile number"),
});

const MAX_ADMIN_LIMIT = 20;

// POST: Public endpoint for requesting admin access (Sign Up)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = adminSignUpSchema.parse(body);

    // 1. Check capacity limit (Max 20 admins)
    const { approved, pending } = await countActiveAdmins();
    if (approved + pending >= MAX_ADMIN_LIMIT) {
      return NextResponse.json(
        {
          error: `Maximum admin registration limit (${MAX_ADMIN_LIMIT} members) has been reached. Please contact the Main Creator Admin.`,
        },
        { status: 400 }
      );
    }

    // 2. Check for duplicate email
    const existingUser = await findAdminUserByEmail(validated.email);
    if (existingUser) {
      if (existingUser.status === "APPROVED") {
        return NextResponse.json(
          {
            error: "This email is already an approved admin. Please log in using your registered Name as Username and Email as Secret Key.",
          },
          { status: 400 }
        );
      }
      if (existingUser.status === "PENDING") {
        return NextResponse.json(
          {
            error: "An access request for this email is already awaiting Main Admin approval.",
          },
          { status: 400 }
        );
      }
      if (existingUser.status === "DISAPPROVED" || existingUser.status === "REVOKED") {
        return NextResponse.json(
          {
            error: "Your previous admin access request was rejected or revoked. Please contact the Main Admin.",
          },
          { status: 403 }
        );
      }
    }

    // 3. Create new admin access request (preserves exact name spelling & casing)
    const newAdmin = await createAdminUserRecord({
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
    });

    // 4. Audit Log
    try {
      const supabase = getSupabaseServerClient();
      await supabase.from("audit_logs").insert({
        action: "ADMIN_ACCESS_REQUESTED",
        actor_type: "ADMIN",
        actor_identifier: validated.email,
        metadata: {
          name: validated.name,
          phone: validated.phone,
          status: "PENDING",
        },
      });
    } catch (auditErr) {
      console.warn("Audit log creation skipped:", auditErr);
    }

    return NextResponse.json({
      success: true,
      message:
        "Admin access request submitted successfully! Your account is pending Main Admin approval. Once approved, use your Name as Username and Email as Secret Key to log in.",
      user: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        status: newAdmin.status,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || "Validation error" },
        { status: 400 }
      );
    }
    console.error("Admin request error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process admin access request" },
      { status: 500 }
    );
  }
}

// GET: Main Admin only endpoint to list all admin access requests
export async function GET(req: NextRequest) {
  try {
    if (!isSuperAdminAuthenticated(req)) {
      return NextResponse.json(
        { error: "Access denied. Only the Main Creator Admin can view and manage admin access requests." },
        { status: 403 }
      );
    }

    const records = await getAllAdminUsers();

    const total = records.length;
    const approved = records.filter((u) => u.status === "APPROVED").length;
    const pending = records.filter((u) => u.status === "PENDING").length;
    const disapproved = records.filter((u) => u.status === "DISAPPROVED" || u.status === "REVOKED").length;

    return NextResponse.json({
      requests: records,
      stats: {
        total,
        approved,
        pending,
        disapproved,
        maxLimit: MAX_ADMIN_LIMIT,
        remainingSlots: Math.max(0, MAX_ADMIN_LIMIT - approved),
      },
    });
  } catch (error: any) {
    console.error("Admin requests GET error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load admin requests" },
      { status: 500 }
    );
  }
}
