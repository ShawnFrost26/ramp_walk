import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();

    // 1. Fetch registration record
    const { data: registration, error: regError } = await supabase
      .from("registrations")
      .select("id, full_name, photo_storage_path")
      .eq("id", id)
      .maybeSingle();

    if (regError || !registration) {
      return generateSvgAvatar("NA", "Participant Not Found");
    }

    const path = registration.photo_storage_path;

    if (!path) {
      return generateSvgAvatar(getInitials(registration.full_name), registration.full_name);
    }

    // 2. If it's a data URL, parse and return buffer
    if (path.startsWith("data:")) {
      const matches = path.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": mimeType,
            "Cache-Control": "public, max-age=86400",
          },
        });
      }
    }

    // 3. If it's an external HTTP/HTTPS URL, redirect directly
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return NextResponse.redirect(path);
    }

    // 4. If it's in Supabase Storage, download image buffer via service role client
    try {
      const cleanPath = path.startsWith("mock/") ? path.replace("mock/", "") : path;
      const { data: fileData, error: downloadError } = await supabase.storage
        .from("registration-photos")
        .download(cleanPath);

      if (!downloadError && fileData) {
        const arrayBuffer = await fileData.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": fileData.type || "image/jpeg",
            "Cache-Control": "public, max-age=3600",
          },
        });
      }

      // If download fails, attempt signed URL redirect
      const { data: signedData } = await supabase.storage
        .from("registration-photos")
        .createSignedUrl(cleanPath, 3600);

      if (signedData?.signedUrl) {
        return NextResponse.redirect(signedData.signedUrl);
      }
    } catch (storageErr) {
      console.warn("Storage fetch exception:", storageErr);
    }

    // 5. Fallback SVG avatar if file is unavailable in dev
    return generateSvgAvatar(getInitials(registration.full_name), registration.full_name);
  } catch (error: any) {
    console.error("Admin photo route error:", error);
    return generateSvgAvatar("NA", "Participant");
  }
}

function getInitials(name: string): string {
  if (!name) return "DP";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function generateSvgAvatar(initials: string, name: string): NextResponse {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="380" viewBox="0 0 300 380">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#900C22;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#A26715;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="300" height="380" fill="url(#grad)" rx="16" />
    <circle cx="150" cy="150" r="65" fill="#FFFFFF" fill-opacity="0.15" />
    <text x="150" y="165" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="bold" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">${initials}</text>
    <text x="150" y="270" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${name.length > 22 ? name.substring(0, 20) + "..." : name}</text>
    <rect x="90" y="300" width="120" height="24" rx="12" fill="#FFFFFF" fill-opacity="0.2" />
    <text x="150" y="316" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">DELEGATE</text>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
