import type { IncomingMessage, ServerResponse } from "http";
import nodemailer from "nodemailer";

const SENDER_EMAIL = process.env.SMTP_EMAIL || "info.rista2025@gmail.com";
const APP_PASSWORD = process.env.SMTP_APP_PASSWORD || "oeoysisyrjvvrwyy";
const ADMIN_EMAIL = "info.rista2025@gmail.com";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: SENDER_EMAIL,
    pass: APP_PASSWORD,
  },
});

async function parseBody(req: any): Promise<any> {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: any) => {
      body += chunk;
      if (body.length > 50 * 1024) reject(new Error("Payload too large"));
    });
    req.on("end", () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function buildUserEmailHtml(fullName: string, whatsappNumber: string, city: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to Rishta Matrimony</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2d3748;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f5f0; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1f4037, #2c7a7b); padding: 35px 25px; text-align: center; color: #ffffff;">
              <div style="font-size: 20px; font-family: serif; margin-bottom: 6px; opacity: 0.9;">﷽</div>
              <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">Rishta Matrimony</h1>
              <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9; color: #e2e8f0;">Islamic Matchmaking & Matrimonial Community</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 35px 30px;">
              <h2 style="margin-top: 0; color: #1f4037; font-size: 21px;">Assalamu Alaikum wa Rahmatullah, ${fullName || "Respected Member"}</h2>
              
              <p style="font-size: 15px; line-height: 1.7; color: #4a5568;">
                Shukran! Your profile registration has been received successfully on <strong>Rishta Matrimony</strong>.
              </p>

              <p style="font-size: 15px; line-height: 1.7; color: #4a5568;">
                May Allah (SWT) bless your noble intention of completing half your deen and grant you a righteous, caring, and compatible life partner.
              </p>

              <!-- WhatsApp Verification Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f0fdf4; border: 1.5px solid #86efac; border-radius: 10px; margin: 25px 0;">
                <tr>
                  <td style="padding: 22px;">
                    <div style="margin-bottom: 10px;">
                      <span style="font-size: 20px; vertical-align: middle; margin-right: 6px;">📲</span>
                      <strong style="color: #15803d; font-size: 16px; vertical-align: middle;">Next Step: WhatsApp Profile Verification</strong>
                    </div>
                    <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #166534;">
                      Our team will reach out to you shortly on your registered WhatsApp number ${whatsappNumber ? `(<strong>+91 ${whatsappNumber}</strong>)` : ""} to verify your biodata details and complete your profile approval.
                    </p>
                    <p style="margin: 10px 0 0; font-size: 13px; line-height: 1.6; color: #15803d;">
                      Once verified, your profile will be activated on the platform so you can explore and connect with compatible matches.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Safety & Privacy Assurance -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 8px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 15px 18px;">
                    <div style="color: #9d174d; font-size: 13px; line-height: 1.6;">
                      🔒 <strong>100% Privacy & Data Protection:</strong> Your personal biodata, photographs, and contact information are strictly protected in accordance with authentic Islamic modesty and privacy guidelines.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0 15px;">
                <a href="https://rishtamatrimony.vercel.app/" style="background: linear-gradient(135deg, #1f4037, #2c7a7b); color: #ffffff; text-decoration: none; padding: 13px 30px; font-size: 14px; font-weight: 600; border-radius: 8px; display: inline-block;">
                  Visit Rishta Matrimony
                </a>
              </div>

              <!-- Support Note -->
              <p style="font-size: 13px; color: #718096; text-align: center; line-height: 1.6; margin-top: 20px;">
                Need help or have questions? Contact us:<br/>
                WhatsApp: <strong>+91 9128719875</strong> | Email: <strong>info.rista2025@gmail.com</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #edf2f7; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #718096;">
                © 2026 Rishta Matrimony. All rights reserved.<br/>
                Connecting Muslim hearts with authentic Islamic values.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default async function handler(req: any, res: any) {
  // Allow POST only
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body = await parseBody(req);
    const { full_name, email, whatsapp_number, city, gender } = body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    // 1. Send confirmation email to the user who registered
    const userMailOptions = {
      from: `Rishta Matrimony <${SENDER_EMAIL}>`,
      to: email,
      subject: `🌸 Assalamu Alaikum ${full_name || ""} – Registration Received (Rishta Matrimony)`,
      html: buildUserEmailHtml(full_name, whatsapp_number, city),
    };

    // 2. Send notification to admin
    const adminMailOptions = {
      from: `Rishta Matrimony Alerts <${SENDER_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `✨ New Profile Registration: ${full_name || "New Member"} (${gender || "N/A"}, ${city || "N/A"})`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #1f4037;">New Profile Registered</h2>
          <p><strong>Name:</strong> ${full_name}</p>
          <p><strong>Gender:</strong> ${gender}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp_number}</p>
          <p>Please review and verify on WhatsApp.</p>
        </div>
      `,
    };

    // Send both asynchronously
    await Promise.allSettled([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    return res.status(200).json({ success: true, message: "Emails sent successfully" });
  } catch (err: any) {
    console.error("Error in registration email dispatcher:", err);
    return res.status(500).json({ error: "Failed to send email", details: err.message });
  }
}
