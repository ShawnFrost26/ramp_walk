import fs from "fs";
import path from "path";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "SUPER_ADMIN" | "SUB_ADMIN";
  status: "PENDING" | "APPROVED" | "DISAPPROVED" | "REVOKED";
  requested_at: string;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "admin_users.json");

function ensureFileExists(): AdminUserRecord[] {
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

function writeLocal(records: AdminUserRecord[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(records, null, 2), "utf-8");
  } catch (e) {
    console.warn("writeLocal notice:", e);
  }
}

export async function getAllAdminUsers(): Promise<AdminUserRecord[]> {
  const supabase = getSupabaseServerClient();

  // 1. Try dedicated admin_users table in Supabase
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      writeLocal(data as AdminUserRecord[]);
      return data as AdminUserRecord[];
    }
  } catch (e) {
    console.warn("admin_users table not found, checking cloud audit_logs storage:", e);
  }

  // 2. Cloud Fallback: Use live Supabase audit_logs table (always accessible in Supabase!)
  try {
    const { data: auditRecords, error: auditErr } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("action", "ADMIN_ACCESS_REQUEST")
      .order("created_at", { ascending: false });

    if (!auditErr && Array.isArray(auditRecords) && auditRecords.length > 0) {
      const mapped: AdminUserRecord[] = auditRecords.map((r: any) => ({
        id: r.metadata?.id || r.id,
        name: r.metadata?.name || r.actor_identifier,
        email: (r.metadata?.email || r.actor_identifier || "").toLowerCase().trim(),
        phone: r.metadata?.phone || "",
        role: r.metadata?.role || "SUB_ADMIN",
        status: r.metadata?.status || "PENDING",
        requested_at: r.metadata?.requested_at || r.created_at,
        reviewed_at: r.metadata?.reviewed_at || null,
        reviewed_by: r.metadata?.reviewed_by || null,
        admin_notes: r.metadata?.admin_notes || null,
        created_at: r.created_at,
        updated_at: r.created_at,
      }));

      writeLocal(mapped);
      return mapped;
    }
  } catch (e) {
    console.warn("Supabase audit_logs fetch notice:", e);
  }

  // 3. Fallback to local storage cache
  return ensureFileExists();
}

export async function findAdminUserByEmail(email: string): Promise<AdminUserRecord | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const all = await getAllAdminUsers();
  return all.find((u) => u.email.toLowerCase() === normalizedEmail) || null;
}

export async function countActiveAdmins(): Promise<{ approved: number; pending: number; total: number }> {
  const all = await getAllAdminUsers();
  const approved = all.filter((u) => u.status === "APPROVED").length;
  const pending = all.filter((u) => u.status === "PENDING").length;
  return { approved, pending, total: all.length };
}

export async function createAdminUserRecord(payload: {
  name: string;
  email: string;
  phone: string;
}): Promise<AdminUserRecord> {
  const now = new Date().toISOString();
  const newRecord: AdminUserRecord = {
    id: `adm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: payload.name.trim(), // Exact name & casing preserved
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    role: "SUB_ADMIN",
    status: "PENDING",
    requested_at: now,
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabaseServerClient();

  // 1. Try insert into admin_users table
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .insert({
        name: newRecord.name,
        email: newRecord.email,
        phone: newRecord.phone,
        role: newRecord.role,
        status: newRecord.status,
        requested_at: newRecord.requested_at,
      })
      .select()
      .single();

    if (!error && data) {
      newRecord.id = data.id;
    }
  } catch {
    // Graceful fallback to audit_logs
  }

  // 2. ALWAYS Persist to Supabase audit_logs (passes actor_type check constraint 'ADMIN')
  try {
    // Remove any previous pending request for this email first
    await supabase
      .from("audit_logs")
      .delete()
      .eq("action", "ADMIN_ACCESS_REQUEST")
      .eq("actor_identifier", newRecord.email);

    const { data: auditData, error: auditErr } = await supabase
      .from("audit_logs")
      .insert({
        action: "ADMIN_ACCESS_REQUEST",
        actor_type: "ADMIN",
        actor_identifier: newRecord.email,
        metadata: {
          id: newRecord.id,
          name: newRecord.name,
          email: newRecord.email,
          phone: newRecord.phone,
          role: newRecord.role,
          status: newRecord.status,
          requested_at: newRecord.requested_at,
        },
      })
      .select()
      .single();

    if (!auditErr && auditData) {
      newRecord.id = auditData.id;
    } else if (auditErr) {
      console.error("audit_logs insert error:", auditErr);
    }
  } catch (e) {
    console.error("audit_logs insert exception:", e);
  }

  // 3. Update local cache
  const localList = ensureFileExists();
  const existingIdx = localList.findIndex((u) => u.email === newRecord.email);
  if (existingIdx !== -1) {
    localList[existingIdx] = newRecord;
  } else {
    localList.unshift(newRecord);
  }
  writeLocal(localList);

  return newRecord;
}

export async function updateAdminUserStatus(
  id: string,
  status: "APPROVED" | "DISAPPROVED" | "REVOKED" | "PENDING",
  adminNotes?: string
): Promise<AdminUserRecord | null> {
  const now = new Date().toISOString();
  const supabase = getSupabaseServerClient();
  let updatedRecord: AdminUserRecord | null = null;

  // 1. Try update admin_users table
  try {
    const { data } = await supabase
      .from("admin_users")
      .update({
        status,
        reviewed_at: now,
        reviewed_by: "Main Creator Admin",
        admin_notes: adminNotes || null,
        updated_at: now,
      })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (data) {
      updatedRecord = data as AdminUserRecord;
    }
  } catch {
    // Ignore and proceed with audit_logs
  }

  // 2. Update Supabase audit_logs
  try {
    // Find matching audit record by ID or email
    const { data: records } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("action", "ADMIN_ACCESS_REQUEST");

    const match = (records || []).find(
      (r: any) => r.id === id || r.metadata?.id === id || r.actor_identifier === id
    );

    if (match) {
      const updatedMeta = {
        ...(match.metadata || {}),
        status,
        reviewed_at: now,
        reviewed_by: "Main Creator Admin",
        admin_notes: adminNotes || null,
      };

      await supabase
        .from("audit_logs")
        .update({ metadata: updatedMeta })
        .eq("id", match.id);

      updatedRecord = {
        id: match.id,
        name: updatedMeta.name || match.actor_identifier,
        email: (updatedMeta.email || match.actor_identifier || "").toLowerCase().trim(),
        phone: updatedMeta.phone || "",
        role: updatedMeta.role || "SUB_ADMIN",
        status: status,
        requested_at: updatedMeta.requested_at || match.created_at,
        reviewed_at: now,
        reviewed_by: "Main Creator Admin",
        admin_notes: adminNotes || null,
        created_at: match.created_at,
        updated_at: now,
      };
    }

    // Also log the action
    await supabase.from("audit_logs").insert({
      action: `ADMIN_ACCESS_${status}`,
      actor_type: "ADMIN",
      actor_identifier: "admin",
      metadata: {
        admin_user_id: id,
        new_status: status,
        reviewed_at: now,
      },
    });
  } catch (e) {
    console.error("audit_logs status update error:", e);
  }

  // 3. Update local cache
  const localList = ensureFileExists();
  const idx = localList.findIndex(
    (u) => u.id === id || u.email.toLowerCase() === id.toLowerCase()
  );
  if (idx !== -1) {
    localList[idx].status = status;
    localList[idx].reviewed_at = now;
    localList[idx].reviewed_by = "Main Creator Admin";
    if (adminNotes !== undefined) localList[idx].admin_notes = adminNotes;
    localList[idx].updated_at = now;
    writeLocal(localList);
    if (!updatedRecord) updatedRecord = localList[idx];
  }

  return updatedRecord;
}

export async function deleteAdminUserRecord(id: string): Promise<boolean> {
  const supabase = getSupabaseServerClient();

  try {
    await supabase.from("admin_users").delete().eq("id", id);
  } catch {
    // Ignore
  }

  try {
    // Delete from audit_logs by ID or actor_identifier
    await supabase
      .from("audit_logs")
      .delete()
      .eq("action", "ADMIN_ACCESS_REQUEST")
      .eq("id", id);

    await supabase
      .from("audit_logs")
      .delete()
      .eq("action", "ADMIN_ACCESS_REQUEST")
      .eq("actor_identifier", id);
  } catch (e) {
    console.error("audit_logs delete error:", e);
  }

  const localList = ensureFileExists();
  const filtered = localList.filter((u) => u.id !== id && u.email !== id);
  writeLocal(filtered);
  return true;
}
