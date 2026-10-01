import { NextRequest, NextResponse } from "next/server";
import { EVENT_DETAILS } from "@/lib/constants/event";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Validate file size (1 MB limit)
    if (file.size > EVENT_DETAILS.maxPhotoSizeBytes) {
      return NextResponse.json(
        {
          error: `File size exceeds the 1 MB limit (uploaded size: ${(
            file.size /
            (1024 * 1024)
          ).toFixed(2)} MB). Please compress your photo before uploading.`,
        },
        { status: 400 }
      );
    }

    // 2. Validate MIME type
    if (!EVENT_DETAILS.allowedPhotoTypes.includes(file.type as any)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed." },
        { status: 400 }
      );
    }

    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const storagePath = `participants/${fileName}`;

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const supabase = getSupabaseServerClient();

    // 3. Attempt upload to Supabase Storage bucket
    const { data, error } = await supabase.storage
      .from("registration-photos")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.warn("Supabase Storage upload warning:", error.message);
      // Fallback for development if bucket does not exist yet: return base64 preview
      const base64Data = buffer.toString("base64");
      const dataUri = `data:${file.type};base64,${base64Data}`;
      return NextResponse.json({
        storagePath: `mock/${storagePath}`,
        publicUrl: dataUri,
        isMock: true,
      });
    }

    // Generate signed URL (expires in 1 hour) for private viewing
    const { data: signedData } = await supabase.storage
      .from("registration-photos")
      .createSignedUrl(storagePath, 3600);

    return NextResponse.json({
      storagePath: data.path,
      publicUrl: signedData?.signedUrl || "",
    });
  } catch (error: any) {
    console.error("Photo upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process photo upload" },
      { status: 500 }
    );
  }
}
