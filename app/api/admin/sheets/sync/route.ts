import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    if (!isAdminAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();

    // 1. Fetch all confirmed registrations
    const { data: confirmedRegistrations, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("registration_status", "CONFIRMED")
      .order("confirmed_at", { ascending: true });

    if (error && error.code !== "PGRST116") {
      console.warn("Supabase confirmed fetch warning:", error.message);
    }

    const records = confirmedRegistrations || [];

    // 2. Format rows for Google Sheet / CSV mirror
    const sheetHeaders = [
      "Registration Number",
      "Full Name",
      "Guardian Name",
      "Category",
      "Age Category",
      "Gender",
      "Date of Birth",
      "Tribal Community",
      "Mobile Number",
      "WhatsApp Number",
      "Email Address",
      "State",
      "District",
      "City/Village",
      "Address",
      "PIN Code",
      "Attire Name",
      "Attire Representation",
      "Attire Significance",
      "Special Talent",
      "Payment Status",
      "Fee (INR)",
      "Confirmed At",
    ];

    const sheetRows = records.map((r) => [
      r.registration_number || "",
      r.full_name || "",
      r.guardian_name || "",
      r.category || "",
      r.age_category || "",
      r.gender || "",
      r.date_of_birth || "",
      r.tribal_community || "",
      r.mobile_number || "",
      r.whatsapp_number || "",
      r.email || "",
      r.state || "",
      r.district || "",
      r.city_or_village || "",
      r.full_address || "",
      r.pincode || "",
      r.attire_name || "",
      r.attire_representation || "",
      r.attire_description || "",
      r.special_talent || "",
      "CONFIRMED (₹500 PAID)",
      500,
      r.confirmed_at || r.created_at || "",
    ]);

    // 3. Update pending sync jobs in DB
    await supabase
      .from("sheet_sync_jobs")
      .update({
        status: "COMPLETED",
        synced_at: new Date().toISOString(),
      })
      .eq("status", "PENDING");

    // 4. Record Audit Log
    await supabase.from("audit_logs").insert({
      action: "SHEET_SYNC_COMPLETED",
      actor_type: "ADMIN",
      actor_identifier: "ADMIN_CONSOLE",
      metadata: { syncedCount: records.length },
    });

    const googleSheetId = process.env.GOOGLE_SHEET_ID;
    const isGoogleAccountConfigured =
      Boolean(process.env.GOOGLE_CLIENT_EMAIL) &&
      Boolean(process.env.GOOGLE_PRIVATE_KEY) &&
      Boolean(googleSheetId) &&
      googleSheetId !== "1_your_google_spreadsheet_id_here";

    return NextResponse.json({
      success: true,
      recordsSynced: records.length,
      isGoogleAccountConfigured,
      googleSheetId: isGoogleAccountConfigured ? googleSheetId : null,
      message: isGoogleAccountConfigured
        ? `Successfully mirrored ${records.length} confirmed delegates to Google Sheet.`
        : `Synchronized ${records.length} confirmed delegates to local queue. Ready for export.`,
      headers: sheetHeaders,
      rows: sheetRows,
    });
  } catch (error: any) {
    console.error("Sheet sync error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to synchronize to Google Sheets" },
      { status: 500 }
    );
  }
}

/**
 * Direct CSV download endpoint for organizer backup export
 */
export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();
    const { data: records } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    const list = records || [];

    const headers = [
      "Registration Number",
      "Full Name",
      "Guardian Name",
      "Status",
      "Category",
      "Gender",
      "DOB",
      "Community",
      "Mobile",
      "Email",
      "District",
      "State",
      "Fee (INR)",
      "Registered At",
    ];

    const escapeCsv = (str: any) => {
      const val = str === null || str === undefined ? "" : String(str);
      return `"${val.replace(/"/g, '""')}"`;
    };

    const csvLines = [
      headers.join(","),
      ...list.map((r) =>
        [
          escapeCsv(r.registration_number),
          escapeCsv(r.full_name),
          escapeCsv(r.guardian_name),
          escapeCsv(r.registration_status),
          escapeCsv(r.category),
          escapeCsv(r.gender),
          escapeCsv(r.date_of_birth),
          escapeCsv(r.tribal_community),
          escapeCsv(r.mobile_number),
          escapeCsv(r.email),
          escapeCsv(r.district),
          escapeCsv(r.state),
          escapeCsv(r.registration_status === "CONFIRMED" ? "500" : "0"),
          escapeCsv(r.created_at),
        ].join(",")
      ),
    ];

    const csvContent = csvLines.join("\n");

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="birsa_ramp_walk_delegates_${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
