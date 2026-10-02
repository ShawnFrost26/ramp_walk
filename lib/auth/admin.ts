import { NextRequest } from "next/server";

export interface AdminSessionPayload {
  role: "ADMIN" | "SUPER_ADMIN" | "SUB_ADMIN";
  username: string;
  name?: string;
  email?: string;
  isSuperAdmin: boolean;
  authenticatedAt?: string;
}

export function getAdminSession(req: NextRequest): AdminSessionPayload | null {
  const session = req.cookies.get("admin_session")?.value;
  if (!session) return null;

  try {
    const decoded = Buffer.from(session, "base64").toString("utf-8");
    const payload = JSON.parse(decoded);
    if (payload && (payload.role === "ADMIN" || payload.role === "SUPER_ADMIN" || payload.role === "SUB_ADMIN")) {
      return {
        role: payload.role || "ADMIN",
        username: payload.username || "admin",
        name: payload.name || payload.username || "Admin Official",
        email: payload.email,
        isSuperAdmin: Boolean(payload.isSuperAdmin),
        authenticatedAt: payload.authenticatedAt,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(req: NextRequest): boolean {
  return getAdminSession(req) !== null;
}

export function isSuperAdminAuthenticated(req: NextRequest): boolean {
  const session = getAdminSession(req);
  return Boolean(session && session.isSuperAdmin);
}
