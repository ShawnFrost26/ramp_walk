import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const expectedPassword = process.env.ADMIN_SECRET_KEY || "birsa2026admin";
    const expectedUsername = "admin";

    if (username !== expectedUsername || password !== expectedPassword) {
      return NextResponse.json({ error: "Invalid admin username or secret key" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, message: "Admin authenticated successfully" });

    const token = Buffer.from(
      JSON.stringify({
        role: "ADMIN",
        username,
        authenticatedAt: new Date().toISOString(),
      })
    ).toString("base64");

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 12, // 12 hours
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: error?.message || "Admin login failed" }, { status: 500 });
  }
}
