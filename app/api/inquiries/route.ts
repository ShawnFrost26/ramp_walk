import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { sendInquiryNotificationEmail } from "@/lib/email/sender";

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

    const supabase = getSupabaseServerClient();
    const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // Generate fallback ticket number in case trigger isn't executed
    const fallbackTicket = `INQ-${Math.floor(100000 + Math.random() * 900000)}`;

    let ticketNumber = fallbackTicket;
    let inquiryId: string | null = null;

    try {
      const { data, error } = await supabase
        .from("inquiries")
        .insert({
          name: validated.name,
          phone: validated.phone,
          email: validated.email,
          category: validated.category,
          message: validated.message,
          status: "PENDING",
        })
        .select()
        .single();

      if (!error && data) {
        ticketNumber = data.ticket_number || fallbackTicket;
        inquiryId = data.id;

        // Try writing to audit_logs
        try {
          await supabase.from("audit_logs").insert({
            action: "INQUIRY_SUBMITTED",
            actor_type: "DELEGATE",
            actor_identifier: validated.phone,
            metadata: {
              ticket_number: ticketNumber,
              category: validated.category,
              email: validated.email,
              name: validated.name,
            },
          });
        } catch (auditErr) {
          console.warn("Audit log creation skipped:", auditErr);
        }
      } else if (error) {
        console.warn("Supabase insert inquiry warning (using graceful ticket):", error.message);
      }
    } catch (dbErr: any) {
      console.warn("DB connection warning for inquiries:", dbErr.message);
    }

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
