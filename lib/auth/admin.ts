import { NextRequest } from "next/server";

export function isAdminAuthenticated(req: NextRequest): boolean {
  const session = req.cookies.get("admin_session")?.value;
  if (!session) return false;

  try {
    const decoded = Buffer.from(session, "base64").toString("utf-8");
    const payload = JSON.parse(decoded);
    return payload && payload.role === "ADMIN";
  } catch {
    return false;
  }
}
