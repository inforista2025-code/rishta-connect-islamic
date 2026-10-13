import nodemailer from "nodemailer";

// Vercel serverless function max execution time (in seconds)
export const maxDuration = 60;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SENDER_EMAIL = process.env.SMTP_EMAIL || "info.rista2025@gmail.com";
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

interface ProfileRecord {
  id: number;
  name: string;
  gender: string;
  age?: string;
  location?: string;
  profession?: string;
  education?: string;
  email?: string | null;
  is_live?: boolean;
}

interface NewsletterRecipient {
  type: "member" | "visitor";
  email: string;
  name: string;
  subject: string;
  html: string;
}

function buildVisitorNewsletterHtml(maleCount: number, femaleCount: number, recipientEmail: string): string {
  const unsubMailto = `mailto:${SENDER_EMAIL}?subject=Unsubscribe%20Newsletter&body=Please%20unsubscribe%20my%20email:%20${recipientEmail}`;
  const totalCount = maleCount + femaleCount;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Complete Half Your Deen – Rishta Matrimony</title>
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
              <h2 style="margin-top: 0; color: #1f4037; font-size: 21px;">Assalamu Alaikum wa Rahmatullah,</h2>
              <p style="font-size: 15px; line-height: 1.7; color: #4a5568;">
                Are you or your family looking for a righteous, compatible life partner? Take the noble step of <strong>completing half your deen</strong> on <strong>Rishta Matrimony</strong> — India's trusted platform for authentic Islamic matchmaking.
              </p>

              <!-- Live Community Stats Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 1.5px solid #86efac; border-radius: 10px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="text-align: center; margin-bottom: 14px;">
                      <span style="font-size: 22px;">🌟</span>
                      <strong style="color: #166534; font-size: 16px; display: block; margin-top: 4px;">Live Verified Community (${totalCount}+ Profiles)</strong>
                    </div>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td width="50%" align="center" style="padding: 12px; background: #ffffff; border-radius: 8px; border: 1px solid #bbf7d0;">
                          <div style="font-size: 22px; font-weight: 800; color: #15803d;">${maleCount}+</div>
                          <div style="font-size: 13px; color: #4a5568; font-weight: 600;">Verified Grooms</div>
                        </td>
                        <td width="10"></td>
                        <td width="50%" align="center" style="padding: 12px; background: #ffffff; border-radius: 8px; border: 1px solid #bbf7d0;">
                          <div style="font-size: 22px; font-weight: 800; color: #15803d;">${femaleCount}+</div>
                          <div style="font-size: 13px; color: #4a5568; font-weight: 600;">Verified Brides</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Islamic Trust & Privacy Pillars -->
              <h3 style="color: #1f4037; font-size: 16px; margin: 25px 0 12px;">Why Families Trust Rishta Matrimony:</h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; line-height: 1.6; color: #4a5568;">
                    🛡️ <strong>100% Modest & Halal:</strong> Governed strictly by authentic Islamic values and family involvement. No casual dating or unsolicited messaging.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; line-height: 1.6; color: #4a5568;">
                    🔒 <strong>Strict Privacy Protection:</strong> Photographs and personal contact details are completely safeguarded and never exposed to search engines.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; line-height: 1.6; color: #4a5568;">
                    ✓ <strong>WhatsApp Admin Verification:</strong> Every single profile is manually verified on WhatsApp by our team before activation — zero fake accounts.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; line-height: 1.6; color: #4a5568;">
                    ⚡ <strong>Quick & 100% Free:</strong> Creating your matrimonial profile is completely free and takes less than 2 minutes.
                  </td>
                </tr>
              </table>

              <!-- Primary CTA -->
              <div style="text-align: center; margin: 35px 0 25px;">
                <a href="https://rishtamatrimony.vercel.app/register" style="background: linear-gradient(135deg, #1f4037, #2c7a7b); color: #ffffff; text-decoration: none; padding: 15px 36px; font-size: 15px; font-weight: 700; border-radius: 8px; display: inline-block; box-shadow: 0 4px 12px rgba(31, 64, 55, 0.3);">
                  Register Your Matrimonial Profile (Free) →
                </a>
              </div>

              <!-- Assistance Note -->
              <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 14px 18px; text-align: center; margin-top: 25px;">
                <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">
                  💬 <strong>Need help filling your biodata?</strong><br/>
                  Our matrimonial support team is available on WhatsApp to assist you: <strong>+91 9128719875</strong>
                </p>
              </div>

              <p style="font-size: 13px; color: #718096; text-align: center; margin-top: 25px;">
                Visit website: <a href="https://rishtamatrimony.vercel.app/" style="color: #2c7a7b; text-decoration: underline;">rishtamatrimony.vercel.app</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #edf2f7; padding: 25px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #718096; line-height: 1.6;">
                © 2026 Rishta Matrimony. All rights reserved.<br/>
                You received this email because you subscribed on Rishta Matrimony.
              </p>
              <div style="margin-top: 14px;">
                <a href="${unsubMailto}" style="color: #e53e3e; font-size: 12px; text-decoration: underline;">
                  Unsubscribe from this newsletter
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

function buildMemberDigestHtml(member: ProfileRecord, matches: ProfileRecord[], recipientEmail: string): string {
  const unsubMailto = `mailto:${SENDER_EMAIL}?subject=Unsubscribe%20Newsletter&body=Please%20unsubscribe%20my%20email:%20${recipientEmail}`;
  const userName = member.name || "Respected Member";
  const userGender = (member.gender || "male").toLowerCase();
  const targetGenderLabel = userGender === "male" ? "Bride" : "Groom";
  const location = member.location || "Your Region";

  let matchCardsHtml = "";
  for (const m of matches) {
    const mName = m.name || "Verified Candidate";
    const mAge = m.age || "N/A";
    const mProf = m.profession || "Professional";
    const mEdu = m.education || "Graduate";
    const mLoc = m.location || "India";

    matchCardsHtml += `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; margin-bottom: 14px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
      <tr>
        <td style="padding: 16px 20px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td>
                <span style="background: #e6f4ea; color: #137333; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">
                  ✓ Verified ${targetGenderLabel}
                </span>
              </td>
              <td align="right" style="font-size: 12px; color: #718096;">
                📍 ${mLoc}
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding-top: 8px;">
                <h4 style="margin: 0 0 6px; font-size: 16px; color: #1f4037;">${mName}</h4>
                <p style="margin: 0 0 12px; font-size: 13px; color: #4a5568; line-height: 1.6;">
                  • <strong>Age:</strong> ${mAge} yrs &nbsp;|&nbsp; <strong>Profession:</strong> ${mProf}<br/>
                  • <strong>Education:</strong> ${mEdu}
                </p>
                <a href="https://rishtamatrimony.vercel.app/member/login" style="background: #1f4037; color: #ffffff; text-decoration: none; padding: 8px 18px; font-size: 12px; font-weight: 600; border-radius: 6px; display: inline-block;">
                  View Biodata & Request Contact →
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your Personalized Daily Matches – Rishta Matrimony</title>
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
              <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9; color: #e2e8f0;">Personalized Matchmaking Digest</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 35px 30px;">
              <h2 style="margin-top: 0; color: #1f4037; font-size: 21px;">Assalamu Alaikum ${userName},</h2>
              <p style="font-size: 15px; line-height: 1.7; color: #4a5568;">
                Here are your latest verified <strong>${targetGenderLabel} proposals</strong> recommended specifically for your preferences and region (<strong>${location}</strong>):
              </p>

              <!-- Recommended Matches -->
              <div style="margin: 25px 0 15px;">
                <h3 style="margin: 0 0 14px; font-size: 16px; color: #166534;">
                  🎯 Top Recommended ${targetGenderLabel} Matches For You:
                </h3>
                ${matchCardsHtml}
              </div>

              <!-- Unlock & Premium Encouragement Box (₹48 & ₹491) -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 1.5px solid #86efac; border-radius: 10px; margin: 25px 0;">
                <tr>
                  <td style="padding: 22px;">
                    <div style="text-align: center; margin-bottom: 16px;">
                      <span style="font-size: 22px;">💎</span>
                      <strong style="color: #166534; font-size: 17px; display: block; margin-top: 4px;">Connect Directly With Your Chosen Match</strong>
                      <p style="margin: 4px 0 0; font-size: 13px; color: #15803d;">Simple, affordable, halal options to unlock verified family contacts</p>
                    </div>

                    <!-- Option 1: Single Profile Unlock (₹48) -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #ffffff; border: 1px solid #bbf7d0; border-radius: 8px; margin-bottom: 10px;">
                      <tr>
                        <td style="padding: 14px;">
                          <strong style="color: #166534; font-size: 15px;">🎯 Option 1: Single Profile Unlock — Only ₹48</strong>
                          <p style="margin: 4px 0 0; font-size: 13px; color: #4a5568; line-height: 1.5;">
                            Interested in a specific profile? Pay just <strong>₹48</strong> to receive the complete verified biodata, unblurred HD photos, and guardian/family contact numbers directly on your WhatsApp.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Option 2: Full Premium Plan (₹491) -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #ffffff; border: 1px solid #bbf7d0; border-radius: 8px;">
                      <tr>
                        <td style="padding: 14px;">
                          <strong style="color: #166534; font-size: 15px;">⭐ Option 2: Full Premium Plan — ₹491 (60 Days Access)</strong>
                          <p style="margin: 4px 0 0; font-size: 13px; color: #4a5568; line-height: 1.5;">
                            Enjoy <strong>unlimited profile unlocks</strong>, direct contact details across all profiles, 1-on-1 personal matchmaking support, and get your own profile pinned to <strong>Page 1 with a Featured ⭐ Badge</strong> for 3x faster proposals!
                          </p>
                        </td>
                      </tr>
                    </table>

                    <div style="text-align: center; margin-top: 18px;">
                      <a href="https://rishtamatrimony.vercel.app/member/login" style="background: linear-gradient(135deg, #15803d, #166534); color: #ffffff; text-decoration: none; padding: 12px 28px; font-size: 13px; font-weight: 700; border-radius: 6px; display: inline-block; box-shadow: 0 3px 8px rgba(22, 101, 52, 0.3);">
                        Unlock Profiles / Upgrade Plan Now →
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Active Profile Tip (Why Log In Regularly) -->
              <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 16px; margin: 25px 0 15px;">
                <strong style="color: #92400e; font-size: 14px;">💡 Increase Your Proposal Inquiries:</strong>
                <p style="margin: 6px 0 0; font-size: 13px; color: #78350f; line-height: 1.6;">
                  Profiles that log in regularly are featured higher in daily searches and receive <strong>3x more views and proposals</strong> from interested families. Log in today to check if new families have viewed or shortlisted your profile!
                </p>
              </div>

              <!-- Primary CTA Button -->
              <div style="text-align: center; margin: 30px 0 20px;">
                <a href="https://rishtamatrimony.vercel.app/member/login" style="background: #1f4037; color: #ffffff; text-decoration: none; padding: 14px 32px; font-size: 15px; font-weight: 600; border-radius: 8px; display: inline-block;">
                  Log In to Member Dashboard →
                </a>
              </div>

              <p style="font-size: 13px; color: #718096; text-align: center; margin-top: 20px;">
                Visit your website: <a href="https://rishtamatrimony.vercel.app/" style="color: #2c7a7b; text-decoration: underline;">rishtamatrimony.vercel.app</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #edf2f7; padding: 25px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #718096; line-height: 1.6;">
                © 2026 Rishta Matrimony. All rights reserved.<br/>
                You are receiving this digest because you registered on Rishta Matrimony.
              </p>
              <div style="margin-top: 14px;">
                <a href="${unsubMailto}" style="color: #e53e3e; font-size: 12px; text-decoration: underline;">
                  Unsubscribe from Daily Digest
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

async function fetchRecipients(): Promise<NewsletterRecipient[]> {
  const recipients: NewsletterRecipient[] = [];
  const seenEmails = new Set<string>();

  // Fetch all profiles
  let allProfiles: ProfileRecord[] = [];
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles_data?select=id,name,gender,age,location,profession,education,email,is_live,verification_status`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (res.ok) {
      allProfiles = await res.json();
    }
  } catch (err) {
    console.warn("Error reading profiles_data:", err);
  }

  // Filter live profiles and calculate counts
  const liveProfiles = allProfiles.filter((p) => p.is_live === true);
  const maleCount = liveProfiles.filter((p) => (p.gender || "").toLowerCase() === "male").length;
  const femaleCount = liveProfiles.filter((p) => (p.gender || "").toLowerCase() === "female").length;

  // Process Registered Members
  const registeredEmailMap = new Map<string, ProfileRecord>();
  for (const p of allProfiles) {
    const email = (p.email || "").trim().toLowerCase();
    if (email && email.includes("@")) {
      registeredEmailMap.set(email, p);
    }
  }

  for (const [email, member] of registeredEmailMap.entries()) {
    if (seenEmails.has(email)) continue;
    seenEmails.add(email);

    const userGender = (member.gender || "male").toLowerCase();
    const targetGender = userGender === "male" ? "female" : "male";
    const candidates = liveProfiles.filter(
      (c) => (c.gender || "").toLowerCase() === targetGender && c.id !== member.id
    );

    // Location matching
    const memberLoc = (member.location || "").toLowerCase().replace(/,/g, " ");
    const locTokens = memberLoc
      .split(/\s+/)
      .filter((t) => t.length > 3 && !["near", "india", "road", "city"].includes(t));

    const regionalMatches = candidates.filter((c) => {
      const cLoc = (c.location || "").toLowerCase();
      return locTokens.some((tok) => cLoc.includes(tok));
    });

    const otherMatches = candidates.filter((c) => !regionalMatches.includes(c));
    const selectedMatches = [...regionalMatches, ...otherMatches].slice(0, 3);

    const subject = regionalMatches.length > 0
      ? `✨ New Verified Matches in ${member.location || "Your Region"} – Rishta Matrimony`
      : `✨ Recommended Verified Matches For You – Rishta Matrimony`;

    recipients.push({
      type: "member",
      email,
      name: member.name || "Member",
      subject,
      html: buildMemberDigestHtml(member, selectedMatches, email),
    });
  }

  // Process Newsletter-Only Subscribers (visitors who haven't registered)
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
        if (email && email.includes("@") && !seenEmails.has(email)) {
          seenEmails.add(email);
          recipients.push({
            type: "visitor",
            email,
            name: "Valued Member",
            subject: `🌸 Find Your Righteous Partner – ${maleCount + femaleCount}+ Verified Profiles on Rishta Matrimony`,
            html: buildVisitorNewsletterHtml(maleCount, femaleCount, email),
          });
        }
      }
    }
  } catch (err) {
    console.warn("Error reading newsletter_subscribers:", err);
  }

  return recipients;
}

export default async function handler(req: any, res: any) {
  // Allow GET (from Vercel Cron) and POST (manual triggers)
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const recipients = await fetchRecipients();
    const memberCount = recipients.filter((r) => r.type === "member").length;
    const visitorCount = recipients.filter((r) => r.type === "visitor").length;
    console.log(`[Cron Dispatcher] Total: ${recipients.length} recipients (Members: ${memberCount}, Visitors: ${visitorCount}).`);

    let successCount = 0;
    const errors: string[] = [];
    const startTime = Date.now();

    // Paced sending: batches of 2 with a 2-second delay between them
    for (let i = 0; i < recipients.length; i += 2) {
      // Timeout safeguard: gracefully wrap up and report if nearing 52 seconds
      if (Date.now() - startTime > 52000) {
        console.warn(`[Cron Dispatcher] Approaching Vercel execution threshold at recipient ${i}/${recipients.length}. Wrapping up.`);
        break;
      }

      const batch = recipients.slice(i, i + 2);
      await Promise.allSettled(
        batch.map(async (rec) => {
          try {
            await transporter.sendMail({
              from: `Rishta Matrimony <${SENDER_EMAIL}>`,
              to: rec.email,
              subject: rec.subject,
              html: rec.html,
              headers: {
                "List-Unsubscribe": `<mailto:${SENDER_EMAIL}?subject=Unsubscribe>`,
              },
            });
            successCount++;
          } catch (err: any) {
            errors.push(`${rec.email}: ${err.message}`);
          }
        })
      );

      // 2-second delay between outgoing batches
      if (i + 2 < recipients.length) {
        await sleep(2000);
      }
    }

    // Send Admin Summary Report
    try {
      await transporter.sendMail({
        from: `Rishta Matrimony Automation <${SENDER_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `📊 Daily Matrimonial Dispatch: ${successCount}/${recipients.length} Delivered (${memberCount} Members, ${visitorCount} Visitors)`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #1f4037;">Daily Matrimonial Newsletter Report</h2>
            <p><strong>Status:</strong> Completed</p>
            <p><strong>Total Recipients:</strong> ${recipients.length}</p>
            <p><strong>Registered Members:</strong> ${memberCount}</p>
            <p><strong>Newsletter Visitors:</strong> ${visitorCount}</p>
            <p><strong>Successfully Delivered:</strong> ${successCount}</p>
            <p><strong>Failed:</strong> ${errors.length}</p>
            ${errors.length > 0 ? `<p><strong>Errors:</strong><br/>${errors.join("<br/>")}</p>` : ""}
            <p style="color: #718096; font-size: 13px;">Automated dispatch by Vercel Cloud Cron with smart audience segmentation, regional matching, and ₹48/₹491 upgrade incentives.</p>
          </div>
        `,
      });
    } catch (adminErr) {
      console.warn("Could not send admin report:", adminErr);
    }

    return res.status(200).json({
      success: true,
      message: `Dispatched ${successCount} emails (Members: ${memberCount}, Visitors: ${visitorCount})`,
      totalRecipients: recipients.length,
      memberCount,
      visitorCount,
      successCount,
      failedCount: errors.length,
    });
  } catch (err: any) {
    console.error("Cron dispatcher fatal error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
