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
  } catch (e) {
    console.error("Local admin users storage error:", e);
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
    console.error("Failed to write local admin users:", e);
  }
}

export async function getAllAdminUsers(): Promise<AdminUserRecord[]> {
  const supabase = getSupabaseServerClient();
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      // Sync local file as backup cache
      writeLocal(data as AdminUserRecord[]);
      return data as AdminUserRecord[];
    }
  } catch (e) {
    console.warn("Supabase admin_users fetch fallback:", e);
  }

  // Fallback to local storage
  return ensureFileExists();
}

export async function findAdminUserByEmail(email: string): Promise<AdminUserRecord | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const supabase = getSupabaseServerClient();
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (!error && data) {
      return data as AdminUserRecord;
    }
  } catch (e) {
    console.warn("Supabase findAdminUserByEmail fallback:", e);
  }

  const all = ensureFileExists();
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
    name: payload.name.trim(), // Exact name & casing
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    role: "SUB_ADMIN",
    status: "PENDING",
    requested_at: now,
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabaseServerClient();
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
      const all = ensureFileExists();
      all.unshift(data as AdminUserRecord);
      writeLocal(all);
      return data as AdminUserRecord;
    }
  } catch (e) {
    console.warn("Supabase insert admin_users fallback:", e);
  }

  // Fallback to local file
  const localList = ensureFileExists();
  localList.unshift(newRecord);
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

  try {
    const { data, error } = await supabase
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
      .single();

    if (!error && data) {
      const localList = ensureFileExists();
      const idx = localList.findIndex((u) => u.id === id);
      if (idx !== -1) {
        localList[idx] = data as AdminUserRecord;
        writeLocal(localList);
      }
      return data as AdminUserRecord;
    }
  } catch (e) {
    console.warn("Supabase update admin_users fallback:", e);
  }

  // Fallback local update
  const localList = ensureFileExists();
  const idx = localList.findIndex((u) => u.id === id);
  if (idx !== -1) {
    localList[idx].status = status;
    localList[idx].reviewed_at = now;
    localList[idx].reviewed_by = "Main Creator Admin";
    if (adminNotes !== undefined) {
      localList[idx].admin_notes = adminNotes;
    }
    localList[idx].updated_at = now;
    writeLocal(localList);
    return localList[idx];
  }

  return null;
}

export async function deleteAdminUserRecord(id: string): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  try {
    await supabase.from("admin_users").delete().eq("id", id);
  } catch (e) {
    console.warn("Supabase delete admin_users fallback:", e);
  }

  const localList = ensureFileExists();
  const filtered = localList.filter((u) => u.id !== id);
  writeLocal(filtered);
  return true;
}
