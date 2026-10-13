import nodemailer from "nodemailer";

// Vercel serverless function max execution time (in seconds)
export const maxDuration = 60;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const APP_PASSWORD = process.env.SMTP_APP_PASSWORD || "oeoysisyrjvvrwyy";
const ADMIN_EMAIL = "info.rista2025@gmail.com";

const SUPABASE_URL = "https://rxlzlkcdszulyetcxxih.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bHpsa2Nkc3p1bHlldGN4eGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTAzODIsImV4cCI6MjA3NTI2NjM4Mn0.PXcKNOiJlQr_BSqPZKIGTQYKK-e6Y5obVg7WPJm17hM";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: SENDER_EMAIL,
    pass: APP_PASSWORD,
  },
});

async function fetchSubscribers(): Promise<Array<{ name: string; email: string }>> {
  const seen = new Set<string>();
  const subscribers: Array<{ name: string; email: string }> = [];

  // 1. Registered Profiles
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles_data?select=name,email&email=not.is.null`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (res.ok) {
      const rows = await res.json();
      for (const r of rows) {
        const email = (r.email || "").trim().toLowerCase();
        const name = (r.name || "Member").trim();
        if (email && email.includes("@") && !seen.has(email)) {
          seen.add(email);
          subscribers.push({ name, email });
        }
      }
    }
  } catch (err) {
    console.warn("Error reading profiles_data:", err);
  }

  // 2. Newsletter Subscribers
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/newsletter_subscribers?select=email&status=eq.active`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (res.ok) {
      const rows = await res.json();
      for (const r of rows) {
        const email = (r.email || "").trim().toLowerCase();
        if (email && email.includes("@") && !seen.has(email)) {
          seen.add(email);
          subscribers.push({ name: "Valued Member", email });
        }
      }
    }
  } catch (err) {
    console.warn("Error reading newsletter_subscribers:", err);
  }

  return subscribers;
}

function buildNewsletterHtml(userName: string, recipientEmail: string): string {
  const unsubMailto = `mailto:${SENDER_EMAIL}?subject=Unsubscribe%20Newsletter&body=Please%20unsubscribe%20my%20email:%20${recipientEmail}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Rishta Matrimony Daily Digest</title>
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
              <h2 style="margin-top: 0; color: #1f4037; font-size: 20px;">Assalamu Alaikum ${userName},</h2>
              <p style="font-size: 15px; line-height: 1.7; color: #4a5568;">
                Here is your <strong>Daily Matrimonial Digest</strong> from <strong>Rishta Matrimony</strong>. We are dedicated to connecting verified and compatible life partners upholding pure Islamic values and absolute family privacy.
              </p>

              <!-- Highlights Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 10px; font-size: 16px; color: #166534;">🌟 Daily Community Highlights</h3>
                    <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #14532d;">
                      <li><strong>New Verified Profiles</strong>: Discover new members added across various locations, professions, and qualifications.</li>
                      <li><strong>Privacy Protected</strong>: Contact and personal details remain secure and verified.</li>
                      <li><strong>Personalized Search</strong>: Filter profiles according to age, education, maslak, and location.</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- Call to Action -->
              <div style="text-align: center; margin: 35px 0 20px;">
                <a href="https://rishtamatrimony.vercel.app/" style="background: #1f4037; color: #ffffff; text-decoration: none; padding: 14px 32px; font-size: 15px; font-weight: 600; border-radius: 8px; display: inline-block;">
                  View New Matches
                </a>
              </div>

              <p style="font-size: 13px; color: #718096; text-align: center; margin-top: 25px;">
                Visit your website: <a href="https://rishtamatrimony.vercel.app/" style="color: #2c7a7b; text-decoration: underline;">rishtamatrimony.vercel.app</a>
              </p>
            </td>
          </tr>

          <!-- Footer with Unsubscribe Button -->
          <tr>
            <td style="background-color: #edf2f7; padding: 25px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #718096; line-height: 1.6;">
                © 2026 Rishta Matrimony. All rights reserved.<br/>
                You are receiving this email because you registered or subscribed on Rishta Matrimony.
              </p>
              
              <div style="margin-top: 16px; padding-top: 14px; border-top: 1px dashed #cbd5e0;">
                <p style="margin: 0 0 12px; font-size: 13px; color: #4a5568;">
                  No longer wish to receive these daily updates? You can opt out anytime:
                </p>
                <a href="${unsubMailto}" style="background: linear-gradient(135deg, #e53e3e, #c53030); color: #ffffff; text-decoration: none; padding: 11px 26px; font-size: 13px; font-weight: 700; border-radius: 6px; display: inline-block; box-shadow: 0 3px 8px rgba(229, 62, 62, 0.35); letter-spacing: 0.4px;">
                  ✕ Unsubscribe from Daily Digest
                </a>
              </div>
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
  // Allow GET (from Vercel Cron) and POST (manual triggers)
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const subscribers = await fetchSubscribers();
    console.log(`[Cron Dispatcher] Found ${subscribers.length} total subscribers.`);

    let successCount = 0;
    const errors: string[] = [];
    const startTime = Date.now();

    // Paced sending: batches of 2 with a 2-second delay between them
    // This provides human-like sending cadence to prevent Gmail spam detection
    // while comfortably finishing all recipients within Vercel's serverless timeout window.
    for (let i = 0; i < subscribers.length; i += 2) {
      // Timeout safeguard: gracefully wrap up and report if nearing 52 seconds
      if (Date.now() - startTime > 52000) {
        console.warn(`[Cron Dispatcher] Approaching Vercel execution threshold at recipient ${i}/${subscribers.length}. Wrapping up.`);
        break;
      }

      const batch = subscribers.slice(i, i + 2);
      await Promise.allSettled(
        batch.map(async (sub) => {
          try {
            await transporter.sendMail({
              from: `Rishta Matrimony <${SENDER_EMAIL}>`,
              to: sub.email,
              subject: "🌟 Rishta Matrimony – Daily Matches & Community Updates",
              html: buildNewsletterHtml(sub.name, sub.email),
              headers: {
                "List-Unsubscribe": `<mailto:${SENDER_EMAIL}?subject=Unsubscribe>`,
              },
            });
            successCount++;
          } catch (err: any) {
            errors.push(`${sub.email}: ${err.message}`);
          }
        })
      );

      // 2-second delay between outgoing batches
      if (i + 2 < subscribers.length) {
        await sleep(2000);
      }
    }

    // Send Admin Summary Report
    try {
      await transporter.sendMail({
        from: `Rishta Matrimony Automation <${SENDER_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `📊 Daily Newsletter Dispatch Report: ${successCount}/${subscribers.length} Emails Sent`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #1f4037;">Daily Newsletter Dispatch Report</h2>
            <p><strong>Status:</strong> Completed</p>
            <p><strong>Total Recipients:</strong> ${subscribers.length}</p>
            <p><strong>Successfully Delivered:</strong> ${successCount}</p>
            <p><strong>Failed:</strong> ${errors.length}</p>
            ${errors.length > 0 ? `<p><strong>Errors:</strong><br/>${errors.join("<br/>")}</p>` : ""}
            <p style="color: #718096; font-size: 13px;">Sent automatically by Vercel Cloud Cron at 9:00 AM IST.</p>
          </div>
        `,
      });
    } catch (adminErr) {
      console.warn("Could not send admin report:", adminErr);
    }

    return res.status(200).json({
      success: true,
      message: `Dispatched ${successCount} emails to subscribers`,
      totalSubscribers: subscribers.length,
      successCount,
      failedCount: errors.length,
    });
  } catch (err: any) {
    console.error("Cron dispatcher fatal error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
