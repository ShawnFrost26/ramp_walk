import nodemailer from "nodemailer";
import { EVENT_DETAILS } from "@/lib/constants/event";

interface InquiryEmailPayload {
  ticketNumber?: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  message: string;
  submittedAt: string;
}

/**
 * Dispatches inquiry notification directly to the event secretariat email address
 * veerbirsamunda5@gmail.com
 */
export async function sendInquiryNotificationEmail(payload: InquiryEmailPayload): Promise<{ success: boolean; delivered: boolean; error?: string }> {
  const targetEmail = EVENT_DETAILS.email || "veerbirsamunda5@gmail.com";

  const emailSubject = `[Delegate Inquiry] ${payload.ticketNumber ? `[${payload.ticketNumber}] ` : ""}${payload.category} - ${payload.name}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { background: #900C22; color: #ffffff; padding: 24px; text-align: left; }
        .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 0; font-size: 13px; opacity: 0.9; }
        .content { padding: 24px; }
        .badge { display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 700; border-radius: 9999px; background: #fff1f2; color: #900C22; border: 1px solid #fecdd3; margin-bottom: 16px; }
        .field { margin-bottom: 16px; }
        .field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px; }
        .field-value { font-size: 14px; font-weight: 600; color: #0f172a; word-break: break-word; }
        .message-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; margin-top: 8px; }
        .cta-bar { margin-top: 24px; padding-top: 20px; border-top: 1px solid #f1f5f9; display: flex; gap: 12px; }
        .btn { display: inline-block; padding: 10px 18px; border-radius: 8px; font-size: 12px; font-weight: 700; text-decoration: none; text-align: center; }
        .btn-call { background: #0f172a; color: #ffffff; }
        .btn-wa { background: #16a34a; color: #ffffff; }
        .footer { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>Tribal Heritage 2026 Secretariat</h1>
          <p>Dharti Aaba Veer Birsa Munda Ramp Walk 2026 Support Desk</p>
        </div>
        <div class="content">
          ${payload.ticketNumber ? `<div class="badge">Ticket: ${payload.ticketNumber}</div>` : ""}

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="field">
              <div class="field-label">Delegate Name</div>
              <div class="field-value">${payload.name}</div>
            </div>
            <div class="field">
              <div class="field-label">Category / Issue Type</div>
              <div class="field-value">${payload.category}</div>
            </div>
            <div class="field">
              <div class="field-label">Mobile Number</div>
              <div class="field-value"><a href="tel:${payload.phone}" style="color: #900C22; text-decoration: none;">${payload.phone}</a></div>
            </div>
            <div class="field">
              <div class="field-label">Email Address</div>
              <div class="field-value"><a href="mailto:${payload.email}" style="color: #900C22; text-decoration: none;">${payload.email}</a></div>
            </div>
          </div>

          <div class="field" style="margin-top: 12px;">
            <div class="field-label">Query / Issue Description</div>
            <div class="message-box">${payload.message}</div>
          </div>

          <div class="field" style="margin-top: 12px;">
            <div class="field-label">Submitted At</div>
            <div class="field-value" style="font-size: 12px; color: #64748b;">${payload.submittedAt}</div>
          </div>

          <div class="cta-bar">
            <a href="tel:${payload.phone}" class="btn btn-call">Call Delegate</a>
            <a href="https://wa.me/91${payload.phone.replace(/[^0-9]/g, "")}" class="btn btn-wa">WhatsApp Delegate</a>
          </div>
        </div>
        <div class="footer">
          This is an automated notification from the Tribal Heritage 2026 Delegate Portal.<br/>
          Inquiry has been recorded in the Admin Dashboard for immediate resolution.
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
=== NEW DELEGATE INQUIRY ===
Ticket Number: ${payload.ticketNumber || "N/A"}
Submitted: ${payload.submittedAt}

Name: ${payload.name}
Phone: ${payload.phone}
Email: ${payload.email}
Issue Category: ${payload.category}

Message:
${payload.message}

Please log in to the Admin Dashboard to resolve this inquiry.
  `.trim();

  // If SMTP configuration is present in environment
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Tribal Heritage Secretariat" <${smtpUser}>`,
        to: targetEmail,
        replyTo: payload.email,
        subject: emailSubject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`[Email Dispatch] Successfully sent inquiry to ${targetEmail}`);
      return { success: true, delivered: true };
    } catch (err: any) {
      console.error("[Email Dispatch] SMTP Delivery Error:", err);
      return { success: true, delivered: false, error: err.message };
    }
  }

  // Fallback: When direct SMTP is not configured in current environment,
  // log the formatted dispatch. In production, setting SMTP_HOST/USER/PASS activates live delivery.
  console.log(`[Email Dispatch Simulated] Recipient: ${targetEmail} | Subject: "${emailSubject}" | Phone: ${payload.phone}`);
  return { success: true, delivered: false, error: "SMTP not configured (Simulated dispatch logged)" };
}
