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
      const isSuperAdmin = Boolean(
        payload.isSuperAdmin === true ||
        payload.role === "SUPER_ADMIN" ||
        payload.username?.toLowerCase() === "admin"
      );

      return {
        role: isSuperAdmin ? "SUPER_ADMIN" : (payload.role || "ADMIN"),
        username: payload.username || "admin",
        name: payload.name || payload.username || (isSuperAdmin ? "Main Creator Admin" : "Admin Official"),
        email: payload.email,
        isSuperAdmin,
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
  return Boolean(
    session && (
      session.isSuperAdmin === true ||
      session.role === "SUPER_ADMIN" ||
      session.username?.toLowerCase() === "admin"
    )
  );
}
