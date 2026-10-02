import fs from "fs";
import path from "path";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface InquiryRecord {
  id: string;
  ticket_number: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  message: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  admin_notes?: string | null;
  resolved_by?: string | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "inquiries.json");

function ensureFileExists(): InquiryRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const content = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(content || "[]");
  } catch {
    return [];
  }
}

function writeLocal(records: InquiryRecord[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(records, null, 2), "utf-8");
  } catch (e) {
    console.warn("writeLocal inquiries notice:", e);
  }
}

function generateTicketNumber(): string {
  return `INQ-${Math.floor(100000 + Math.random() * 900000)}`;
}

/**
 * Fetch all inquiries with multi-tier storage:
 * 1. Dedicated Supabase public.inquiries table (if exists)
 * 2. Supabase audit_logs with action = 'DELEGATE_INQUIRY' (guaranteed Cloud persistence)
 * 3. Local JSON cache fallback (data/inquiries.json)
 */
export async function getAllInquiries(filters?: {
  status?: string;
  search?: string;
}): Promise<{
  inquiries: InquiryRecord[];
  stats: { total: number; pending: number; resolved: number };
}> {
  const supabase = getSupabaseServerClient();
  let allRecords: InquiryRecord[] = [];

  // 1. Try public.inquiries table in Supabase
  try {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      allRecords = data as InquiryRecord[];
    }
  } catch (e) {
    // Table might not exist yet
  }

  // 2. Fetch from Supabase audit_logs (always active cloud storage in Supabase)
  try {
    const { data: auditData, error: auditErr } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("action", "DELEGATE_INQUIRY")
      .order("created_at", { ascending: false });

    if (!auditErr && Array.isArray(auditData) && auditData.length > 0) {
      const fromAudit: InquiryRecord[] = auditData.map((row: any) => {
        const meta = row.metadata || {};
        return {
          id: meta.id || row.id,
          ticket_number: meta.ticket_number || `INQ-${row.id.substring(0, 6).toUpperCase()}`,
          name: meta.name || "Delegate",
          phone: meta.phone || row.actor_identifier || "",
          email: meta.email || "",
          category: meta.category || "General Inquiry",
          message: meta.message || "",
          status: meta.status || "PENDING",
          admin_notes: meta.admin_notes || null,
          resolved_by: meta.resolved_by || null,
          resolved_at: meta.resolved_at || null,
          created_at: meta.created_at || row.created_at,
          updated_at: meta.updated_at || row.created_at,
        };
      });

      // Merge records by id or ticket_number
      const existingIds = new Set(allRecords.map((r) => r.id));
      const existingTickets = new Set(allRecords.map((r) => r.ticket_number));

      for (const rec of fromAudit) {
        if (!existingIds.has(rec.id) && !existingTickets.has(rec.ticket_number)) {
          allRecords.push(rec);
          existingIds.add(rec.id);
          existingTickets.add(rec.ticket_number);
        }
      }
    }
  } catch (e) {
    console.warn("Error fetching inquiries from audit_logs:", e);
  }

  // 3. Fallback / Merge with local file cache
  const localList = ensureFileExists();
  const existingIds = new Set(allRecords.map((r) => r.id));
  const existingTickets = new Set(allRecords.map((r) => r.ticket_number));

  for (const localRec of localList) {
    if (!existingIds.has(localRec.id) && !existingTickets.has(localRec.ticket_number)) {
      allRecords.push(localRec);
      existingIds.add(localRec.id);
      existingTickets.add(localRec.ticket_number);
    }
  }

  // Sort by created_at descending
  allRecords.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Sync to local cache
  if (allRecords.length > 0) {
    writeLocal(allRecords);
  }

  // Calculate overall stats before filters
  const total = allRecords.length;
  const pending = allRecords.filter(
    (r) => r.status === "PENDING" || r.status === "IN_PROGRESS"
  ).length;
  const resolved = allRecords.filter(
    (r) => r.status === "RESOLVED" || r.status === "CLOSED"
  ).length;

  // Apply filters
  let filtered = allRecords;

  if (filters?.status && filters.status !== "ALL") {
    filtered = filtered.filter((r) => r.status === filters.status);
  }

  if (filters?.search && filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    filtered = filtered.filter((r) => {
      return (
        r.name?.toLowerCase().includes(q) ||
        r.phone?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.ticket_number?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q) ||
        r.message?.toLowerCase().includes(q) ||
        (r.admin_notes && r.admin_notes.toLowerCase().includes(q))
      );
    });
  }

  return {
    inquiries: filtered,
    stats: {
      total,
      pending,
      resolved,
    },
  };
}

/**
 * Create a new inquiry record and persist across Supabase and local cache.
 */
export async function createInquiryRecord(payload: {
  name: string;
  phone: string;
  email: string;
  category: string;
  message: string;
  ticket_number?: string;
}): Promise<InquiryRecord> {
  const now = new Date().toISOString();
  const ticketNumber = payload.ticket_number || generateTicketNumber();
  const recordId = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newRecord: InquiryRecord = {
    id: recordId,
    ticket_number: ticketNumber,
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    email: payload.email.trim().toLowerCase(),
    category: payload.category.trim(),
    message: payload.message.trim(),
    status: "PENDING",
    admin_notes: null,
    resolved_by: null,
    resolved_at: null,
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabaseServerClient();

  // 1. Try public.inquiries table
  try {
    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        name: newRecord.name,
        phone: newRecord.phone,
        email: newRecord.email,
        category: newRecord.category,
        message: newRecord.message,
        ticket_number: newRecord.ticket_number,
        status: newRecord.status,
      })
      .select()
      .single();

    if (!error && data) {
      newRecord.id = data.id || newRecord.id;
      if (data.ticket_number) {
        newRecord.ticket_number = data.ticket_number;
      }
    }
  } catch {
    // Inquiries table may not exist yet, proceed to cloud audit_logs
  }

  // 2. ALWAYS Persist to Supabase audit_logs (passes actor_type constraint 'PARTICIPANT')
  try {
    const { data: auditRow, error: auditErr } = await supabase
      .from("audit_logs")
      .insert({
        action: "DELEGATE_INQUIRY",
        actor_type: "PARTICIPANT",
        actor_identifier: newRecord.phone,
        metadata: {
          id: newRecord.id,
          ticket_number: newRecord.ticket_number,
          name: newRecord.name,
          phone: newRecord.phone,
          email: newRecord.email,
          category: newRecord.category,
          message: newRecord.message,
          status: newRecord.status,
          admin_notes: null,
          resolved_by: null,
          resolved_at: null,
          created_at: newRecord.created_at,
          updated_at: newRecord.updated_at,
        },
      })
      .select()
      .single();

    if (!auditErr && auditRow) {
      // Keep ID consistent with the Supabase row ID if desired, or keep recordId
      if (!newRecord.id || newRecord.id.startsWith("inq_")) {
        newRecord.id = auditRow.id;
      }
    } else if (auditErr) {
      console.warn("Supabase audit_logs insert inquiry warning:", auditErr);
    }
  } catch (auditException) {
    console.error("audit_logs insert inquiry exception:", auditException);
  }

  // 3. Update local cache
  const localList = ensureFileExists();
  localList.unshift(newRecord);
  writeLocal(localList);

  return newRecord;
}

/**
 * Update inquiry status and admin notes across Supabase and local cache.
 */
export async function updateInquiryStatus(
  id: string,
  updates: {
    status?: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    admin_notes?: string;
  }
): Promise<InquiryRecord | null> {
  const now = new Date().toISOString();
  const supabase = getSupabaseServerClient();
  let updatedRecord: InquiryRecord | null = null;

  // 1. Try update public.inquiries table
  try {
    const updatePayload: Record<string, any> = {
      updated_at: now,
    };
    if (updates.status) {
      updatePayload.status = updates.status;
      if (updates.status === "RESOLVED" || updates.status === "CLOSED") {
        updatePayload.resolved_at = now;
        updatePayload.resolved_by = "Admin Secretariat";
      } else {
        updatePayload.resolved_at = null;
        updatePayload.resolved_by = null;
      }
    }
    if (updates.admin_notes !== undefined) {
      updatePayload.admin_notes = updates.admin_notes;
    }

    const { data } = await supabase
      .from("inquiries")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (data) {
      updatedRecord = data as InquiryRecord;
    }
  } catch {
    // Ignore and proceed with audit_logs
  }

  // 2. Update Supabase audit_logs
  try {
    const { data: records } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("action", "DELEGATE_INQUIRY");

    const match = (records || []).find(
      (r: any) =>
        r.id === id ||
        r.metadata?.id === id ||
        r.metadata?.ticket_number === id
    );

    if (match) {
      const currentMeta = match.metadata || {};
      const newStatus = updates.status || currentMeta.status || "PENDING";
      const isResolved = newStatus === "RESOLVED" || newStatus === "CLOSED";

      const updatedMeta = {
        ...currentMeta,
        status: newStatus,
        admin_notes:
          updates.admin_notes !== undefined
            ? updates.admin_notes
            : currentMeta.admin_notes || null,
        resolved_at: isResolved ? now : null,
        resolved_by: isResolved ? "Admin Secretariat" : null,
        updated_at: now,
      };

      await supabase
        .from("audit_logs")
        .update({ metadata: updatedMeta })
        .eq("id", match.id);

      updatedRecord = {
        id: match.id,
        ticket_number: updatedMeta.ticket_number || match.id,
        name: updatedMeta.name || "Delegate",
        phone: updatedMeta.phone || match.actor_identifier || "",
        email: updatedMeta.email || "",
        category: updatedMeta.category || "General Inquiry",
        message: updatedMeta.message || "",
        status: newStatus,
        admin_notes: updatedMeta.admin_notes,
        resolved_by: updatedMeta.resolved_by,
        resolved_at: updatedMeta.resolved_at,
        created_at: updatedMeta.created_at || match.created_at,
        updated_at: now,
      };

      // Record administrative resolution audit
      await supabase.from("audit_logs").insert({
        action: newStatus === "RESOLVED" ? "INQUIRY_RESOLVED" : "INQUIRY_STATUS_UPDATED",
        actor_type: "ADMIN",
        actor_identifier: "Secretariat Desk",
        metadata: {
          inquiry_id: id,
          ticket_number: updatedRecord.ticket_number,
          new_status: newStatus,
          admin_notes: updates.admin_notes,
        },
      });
    }
  } catch (e) {
    console.error("audit_logs inquiry update exception:", e);
  }

  // 3. Update local cache
  const localList = ensureFileExists();
  const idx = localList.findIndex(
    (r) => r.id === id || r.ticket_number === id
  );

  if (idx !== -1) {
    if (updates.status) {
      localList[idx].status = updates.status;
      if (updates.status === "RESOLVED" || updates.status === "CLOSED") {
        localList[idx].resolved_at = now;
        localList[idx].resolved_by = "Admin Secretariat";
      } else {
        localList[idx].resolved_at = null;
        localList[idx].resolved_by = null;
      }
    }
    if (updates.admin_notes !== undefined) {
      localList[idx].admin_notes = updates.admin_notes;
    }
    localList[idx].updated_at = now;
    writeLocal(localList);

    if (!updatedRecord) {
      updatedRecord = localList[idx];
    }
  }

  return updatedRecord;
}

/**
 * Delete inquiry record across storage layers
 */
export async function deleteInquiryRecord(id: string): Promise<boolean> {
  const supabase = getSupabaseServerClient();

  try {
    await supabase.from("inquiries").delete().eq("id", id);
  } catch {
    // Ignore
  }

  try {
    await supabase
      .from("audit_logs")
      .delete()
      .eq("action", "DELEGATE_INQUIRY")
      .eq("id", id);
  } catch (e) {
    console.warn("Delete inquiry from audit_logs warning:", e);
  }

  const localList = ensureFileExists();
  const filtered = localList.filter((r) => r.id !== id && r.ticket_number !== id);
  writeLocal(filtered);

  return true;
}
