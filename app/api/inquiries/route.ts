import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendInquiryNotificationEmail } from "@/lib/email/sender";
import { createInquiryRecord } from "@/lib/db/inquiries";

const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be a valid 10-digit number"),
  email: z.string().email("Please provide a valid email address"),
  category: z.string().default("General Inquiry"),
  message: z.string().min(5, "Message must be at least 5 characters").max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = inquirySchema.parse(body);

    const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // Persist inquiry record across Supabase and local cache
    const inquiry = await createInquiryRecord({
      name: validated.name,
      phone: validated.phone,
      email: validated.email,
      category: validated.category,
      message: validated.message,
    });

    const ticketNumber = inquiry.ticket_number;
    const inquiryId = inquiry.id;

    // Dispatch email directly to secretariat (veerbirsamunda5@gmail.com)
    const emailResult = await sendInquiryNotificationEmail({
      ticketNumber,
      name: validated.name,
      phone: validated.phone,
      email: validated.email,
      category: validated.category,
      message: validated.message,
      submittedAt,
    });

    return NextResponse.json({
      success: true,
      ticketNumber,
      inquiryId,
      emailDelivered: emailResult.delivered,
      message: "Your inquiry has been submitted and forwarded directly to the event secretariat.",
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit inquiry. Please try again or contact via WhatsApp." },
      { status: 500 }
    );
  }
}
