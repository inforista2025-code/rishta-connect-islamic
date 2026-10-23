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
  caste?: string;
  maslak?: string;
  email?: string | null;
  is_live?: boolean;
  verification_status?: string;
  created_at?: string;
  admin_notes?: string | null;
}

interface NewsletterRecipient {
  type: "member" | "visitor";
  email: string;
  name: string;
  subject: string;
  html: string;
  profileId?: number;
  adminNotes?: string | null;
}

function isValidEmailFormat(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const clean = email.trim().toLowerCase();

  // RFC standard email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(clean)) return false;

  const parts = clean.split("@");
  if (parts.length !== 2) return false;
  const [user, domain] = parts;
  if (!user || !domain) return false;

  const blockedDomains = [
    "example.com",
    "example.org",
    "test.com",
    "test.in",
    "dummy.com",
    "fake.com",
    "sample.com",
    "mailinator.com",
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
  ];
  if (blockedDomains.includes(domain)) return false;

  const domainParts = domain.split(".");
  if (domainParts.length < 2) return false;
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) return false;

  return true;
}

function isFatalBounceError(err: any): boolean {
  if (!err) return false;
  const message = (err.message || "").toLowerCase();
  const response = (err.response || "").toLowerCase();
  const code = err.code || "";
  const responseCode = err.responseCode;

  // SMTP 5xx permanent rejection codes
  if (responseCode >= 500 && responseCode <= 559) return true;
  if (code === "EENVELOPE") return true;

  const bouncePatterns = [
    "550",
    "551",
    "552",
    "553",
    "554",
    "user unknown",
    "user not found",
    "does not exist",
    "no such user",
    "recipient address rejected",
    "invalid recipient",
    "address rejected",
    "mailbox unavailable",
    "mailbox not found",
    "undeliverable",
    "relay access denied",
    "domain not found",
    "host or domain name not found",
    "bad destination mailbox",
    "disabled",
    "inactive user",
  ];

  return bouncePatterns.some((pattern) => message.includes(pattern) || response.includes(pattern));
}

async function deactivateNewsletterSubscriber(email: string, reason: string): Promise<void> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/newsletter_subscribers?email=eq.${encodeURIComponent(email)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        status: "bounced",
        updated_at: new Date().toISOString(),
      }),
    });
    console.log(`[Bounce Protector] Deactivated subscriber ${email}. Status: ${res.status} (Reason: ${reason})`);
  } catch (deactErr) {
    console.warn(`[Bounce Protector] Failed to deactivate subscriber ${email}:`, deactErr);
  }
}

async function markMemberEmailBounced(
  profileId: number,
  currentNotes: string | null | undefined,
  reason: string
): Promise<void> {
  try {
    const noteTag = `[EMAIL_BOUNCED: ${reason.replace(/["\n\r]/g, " ").slice(0, 80)}]`;
    const updatedNotes = currentNotes ? `${currentNotes} | ${noteTag}` : noteTag;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles_data?id=eq.${profileId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        admin_notes: updatedNotes,
        updated_at: new Date().toISOString(),
      }),
    });
    console.log(`[Bounce Protector] Flagged profile #${profileId} as [EMAIL_BOUNCED]. Status: ${res.status}`);
  } catch (flagErr) {
    console.warn(`[Bounce Protector] Failed to flag profile #${profileId}:`, flagErr);
  }
}

function getISTDayOfWeek(): number {
  // Indian Standard Time is UTC + 5:30
  const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  return nowIST.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
}

function buildVisitorNewsletterHtml(
  maleCount: number,
  femaleCount: number,
  recipientEmail: string,
  dayOfWeek: number,
  recipientName?: string
): { subject: string; html: string } {
  const isNamed = !!(recipientName && recipientName !== "Valued Member" && recipientName !== "Member" && recipientName !== "Respected Member" && recipientName !== "Admin");
  const greetingName = isNamed ? recipientName!.trim() : "";
  const namePrefix = greetingName ? `${greetingName}, ` : "";
  const salutation = greetingName ? `As-salamu alaykum ${greetingName},` : "As-salamu alaykum,";
  const unsubMailto = `mailto:${SENDER_EMAIL}?subject=Unsubscribe%20Newsletter&body=Please%20unsubscribe%20my%20email:%20${recipientEmail}`;
  const totalCount = maleCount + femaleCount;

  // 7-Day Rotating Configurations for Newsletter Visitors
  const dailyThemes: Record<
    number,
    {
      subject: string;
      badge: string;
      headline: string;
      introParagraph: string;
      highlightBoxTitle: string;
      highlightBoxBody: string;
    }
  > = {
    0: {
      // Sunday
      subject: `🌟 ${namePrefix}Candidates Added This Week: Take a Sneak Peek on Rishta Matrimony`,
      badge: "Weekend Roundup",
      headline: "Meet New Verified Candidates Added This Week",
      introParagraph:
        "Every single week, dozens of serious and verified Muslim candidates join Rishta Matrimony to complete half their deen. Here is your weekly community highlight.",
      highlightBoxTitle: `🌟 Active Community: ${totalCount}+ Verified Candidates`,
      highlightBoxBody: `With <strong>${maleCount}+ verified grooms</strong> and <strong>${femaleCount}+ verified brides</strong> currently active on our platform, families across India are finding compatible proposals every day.`,
    },
    1: {
      // Monday
      subject: `⚡ ${namePrefix}Find Your Righteous Partner: Register in Under 2 Minutes (100% Free)`,
      badge: "Fresh Week Start",
      headline: "Start Your Matrimonial Journey in Under 2 Minutes",
      introParagraph:
        "Don't delay completing half your deen. Creating your matrimonial profile on Rishta Matrimony is completely free, straightforward, and takes less than 2 minutes.",
      highlightBoxTitle: "⚡ Fast, Free & Frictionless Registration",
      highlightBoxBody:
        "No complex paperwork or hidden charges. Simply provide your basic biodata and partner preferences, and our team will get your profile verified quickly.",
    },
    2: {
      // Tuesday
      subject: "🛡️ 100% Modest & Privacy-Protected: How Rishta Matrimony Protects You",
      badge: "Privacy Guarantee",
      headline: "Your Family's Privacy & Modesty Always Comes First",
      introParagraph:
        "In authentic Islamic matchmaking, modesty (haya) and privacy are sacred. Unlike casual dating or open social apps, Rishta Matrimony safeguards every detail.",
      highlightBoxTitle: "🔒 Four Pillars of Privacy & Security",
      highlightBoxBody:
        "• Photos are protected and not publicly broadcast.<br/>• Personal phone numbers are never shared without verification.<br/>• Zero Google indexing — profiles remain private.<br/>• Direct family & wali involvement.",
    },
    3: {
      // Wednesday
      subject: `📊 ${totalCount}+ Verified Grooms & Brides Awaiting Righteous Matches – Rishta Matrimony`,
      badge: "Community Growth",
      headline: "A Growing Community of Serious Muslim Families",
      introParagraph:
        "Finding a compatible life partner requires genuine, verified options. Our verified network connects families across various professions, education levels, and regions.",
      highlightBoxTitle: `📊 Live Community Numbers: ${totalCount}+ Profiles`,
      highlightBoxBody: `Currently hosting <strong>${maleCount}+ Verified Grooms</strong> and <strong>${femaleCount}+ Verified Brides</strong>, verified personally by our administrative team.`,
    },
    4: {
      // Thursday
      subject: "📲 Zero Fake Profiles: Personally Verified by Admin on WhatsApp – Rishta Matrimony",
      badge: "Verified Trust",
      headline: "Authentic Connections: Every Profile Personally Verified",
      introParagraph:
        "Tired of duplicate or inactive profiles on other websites? Rishta Matrimony enforces a strict manual verification policy before any biodata goes live.",
      highlightBoxTitle: "✓ Personal WhatsApp Verification Process",
      highlightBoxBody:
        "Our administrative team reaches out directly on WhatsApp to verify identity, biodata details, and partner expectations. Need help filling your form? Our helpline is available at <strong>+91 9128719875</strong>.",
    },
    5: {
      // Friday
      subject: "🕌 Jumu'ah Reflection: The Sacred Virtues of Nikah in Islam",
      badge: "Jumu'ah Mubarak",
      headline: "The Noble Sunnah of Completing Half Your Deen",
      introParagraph:
        "On this blessed day of Jumu'ah, take a mindful step towards fulfilling the Prophet's ﷺ noble guidance on marriage, modesty, and righteous partnership.",
      highlightBoxTitle: "📖 Hadith on the Sanctity of Marriage",
      highlightBoxBody:
        "<em>\"When a person marries, they have completed half of their religion, so let them fear Allah regarding the remaining half.\"</em> [Al-Bayhaqi]<br/><br/>May Allah SWT bless your noble intentions and grant you a righteous life partner.",
    },
    6: {
      // Saturday
      subject: "💡 Tired of Traditional Marriage Brokers? Discover Transparent Matchmaking",
      badge: "Modern & Transparent",
      headline: "Dignified, Modern & Transparent Islamic Matchmaking",
      introParagraph:
        "Traditional matchmakers often involve high brokerage fees, long delays, and unclear details. Rishta Matrimony brings transparency, dignity, and direct family access.",
      highlightBoxTitle: "🌟 The Rishta Matrimony Advantage",
      highlightBoxBody:
        "• Direct guardian & family contact access.<br/>• Transparent, affordable plans (starting at just ₹48).<br/>• Self-paced search tailored to your age, education, and maslak.",
    },
  };

  const currentTheme = dailyThemes[dayOfWeek] || dailyThemes[1];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${currentTheme.headline} – Rishta Matrimony</title>
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
              <p style="font-size: 18px; font-weight: 700; color: #1f4037; margin: 0 0 16px 0;">
                ${salutation}
              </p>

              <p style="font-size: 15px; line-height: 1.7; color: #4a5568; margin: 0 0 20px 0;">
                ${currentTheme.introParagraph}
              </p>

              <!-- Daily Thematic Highlight Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 1.5px solid #86efac; border-radius: 10px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <strong style="color: #166534; font-size: 16px; display: block; margin-bottom: 8px;">${currentTheme.highlightBoxTitle}</strong>
                    <div style="font-size: 14px; line-height: 1.7; color: #15803d;">
                      ${currentTheme.highlightBoxBody}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Community Counts Overview -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0;">
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

              <!-- Primary Call To Action -->
              <div style="text-align: center; margin: 35px 0 25px;">
                <a href="https://rishtamatrimony.vercel.app/register" style="background: linear-gradient(135deg, #1f4037, #2c7a7b); color: #ffffff; text-decoration: none; padding: 15px 36px; font-size: 15px; font-weight: 700; border-radius: 8px; display: inline-block; box-shadow: 0 4px 12px rgba(31, 64, 55, 0.3);">
                  Register Your Matrimonial Profile (Free) →
                </a>
              </div>

              <!-- Assistance Note -->
              <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 14px 18px; text-align: center; margin-top: 25px;">
                <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">
                  💬 <strong>Need help creating your biodata?</strong><br/>
                  Our support team is available on WhatsApp to assist you or your family: <strong>+91 9128719875</strong>
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

  return { subject: currentTheme.subject, html };
}

function buildMemberDigestHtml(
  member: ProfileRecord,
  matches: ProfileRecord[],
  recipientEmail: string,
  dayOfWeek: number
): { subject: string; html: string } {
  const unsubMailto = `mailto:${SENDER_EMAIL}?subject=Unsubscribe%20Newsletter&body=Please%20unsubscribe%20my%20email:%20${recipientEmail}`;
  const rawName = (member.name || "").trim();
  const userName = rawName && !["Valued Member", "Member", "Respected Member", "Admin"].includes(rawName) ? rawName : "";
  const salutation = userName ? `As-salamu alaykum ${userName},` : "As-salamu alaykum,";
  const userGender = (member.gender || "male").toLowerCase();
  const targetGenderLabel = userGender === "male" ? "Bride" : "Groom";
  const location = (member.location || "Your Region").trim();

  // 7-Day Rotating Configurations for Verified Members
  const dailyMemberThemes: Record<
    number,
    {
      subject: string;
      badge: string;
      headline: string;
      introNote: string;
      tipTitle: string;
      tipBody: string;
    }
  > = {
    0: {
      // Sunday
      subject: `💎 ${userName ? `${userName}, ` : ""}Ready to Connect? Unlock Verified Contacts for Just ₹48 – Rishta Matrimony`,
      badge: "Sunday Spotlight: Direct Connect",
      headline: "Connect Directly with Your Chosen Proposals Today",
      introNote:
        "Take a moment this Sunday to review your recommended matches. Unlock verified direct contacts for just ₹48, or upgrade to our full Premium Plan for unlimited 2-month access.",
      tipTitle: "💎 Fast-Track Your Matrimonial Search",
      tipBody:
        "Interested in one candidate? Use our single-profile unlock for ₹48. Want unlimited contact access and Page 1 featured placement? Choose our ₹491 Premium Membership.",
    },
    1: {
      // Monday
      subject: `📍 ${userName ? `${userName}, ` : ""}Top Recommended ${targetGenderLabel} Matches in ${location} – Rishta Matrimony`,
      badge: "Regional & Local Focus",
      headline: `Top Recommended ${targetGenderLabel} Proposals in ${location} & Nearby`,
      introNote:
        `Start your week by exploring compatible proposals located in or around <strong>${location}</strong>. Local connections make family meetings and background verification seamless.`,
      tipTitle: "📍 The Power of Regional Compatibility",
      tipBody:
        "Proposals from your own state or neighboring districts often share familiar cultural, educational, and linguistic traditions, making compatibility easier for both families.",
    },
    2: {
      // Tuesday
      subject: `🎓 ${userName ? `${userName}, ` : ""}Highly Qualified Matches: Engineers, Doctors & Graduates – Rishta Matrimony`,
      badge: "Education & Career Spotlight",
      headline: `Highly Educated & Professional ${targetGenderLabel} Candidates`,
      introNote:
        "Compatibility in education and profession brings mutual understanding. Here are verified candidates with strong academic and professional backgrounds curated for you.",
      tipTitle: "🎓 Academic & Professional Profiles",
      tipBody:
        "Our database features verified engineers, doctors, professors, business professionals, and university graduates seeking righteous life partners.",
    },
    3: {
      // Wednesday
      subject: `⭐ ${userName ? `${userName}, ` : ""}Profile Activity & Views: Boost Your Visibility – Rishta Matrimony`,
      badge: "Profile Health & Visibility",
      headline: "Boost Your Profile Rank & Check Profile Views",
      introNote:
        "Active profiles are recommended higher in our matrimonial algorithm. Log in to your dashboard to see who viewed or shortlisted your biodata recently.",
      tipTitle: "⭐ Activity Boost Guarantee",
      tipBody:
        "Members who log in at least once a week receive up to <strong>3x more interest requests</strong>. Keep your preferences updated to receive the best proposals.",
    },
    4: {
      // Thursday
      subject: `✨ ${userName ? `${userName}, ` : ""}Fresh Proposals for You: Newly Verified Candidates – Rishta Matrimony`,
      badge: "Newest Weekly Arrivals",
      headline: `Newly Verified ${targetGenderLabel} Profiles Added This Week`,
      introNote:
        "Every day brings new hopes and fresh proposals. Here are recently approved and verified profiles that match your gender and lifestyle preferences.",
      tipTitle: "✨ Fresh Proposals Every Week",
      tipBody:
        "Be among the first to express interest in newly approved profiles. Early inquiries receive the highest response rates from prospective families.",
    },
    5: {
      // Friday
      subject: `🕌 Jumu'ah Mubarak${userName ? ` ${userName}` : ""}! Curated Proposals for a Blessed Nikah – Rishta Matrimony`,
      badge: "Jumu'ah Mubarak",
      headline: "A Blessed Day to Advance Your Noble Intentions of Nikah",
      introNote:
        `On this blessed Jumu'ah, we present curated, modest <strong>${targetGenderLabel} proposals</strong> upholding authentic Islamic principles.`,
      tipTitle: "📖 Islamic Principle of Compatibility",
      tipBody:
        "<em>\"A woman is married for four things: her wealth, her family status, her beauty, and her religion. So you should marry the religious woman; otherwise you will be a loser.\"</em> [Bukhari]",
    },
    6: {
      // Saturday
      subject: `👨‍👩‍👧‍👦 ${userName ? `${userName}, ` : ""}Weekend Family Review: Curated Matches for You – Rishta Matrimony`,
      badge: "Weekend Family Digest",
      headline: "Review Compatible Proposals with Your Family Today",
      introNote:
        "Weekends provide the ideal time for families to sit together, review biodatas, and discuss prospects with mutual consultation and care.",
      tipTitle: "👨‍👩‍👧‍👦 Family Consultation (Mashwarah)",
      tipBody:
        "Share suitable profiles with your parents or guardians this weekend. Discussing compatibility together brings clarity and barakah into the matrimonial decision.",
    },
  };

  const currentTheme = dailyMemberThemes[dayOfWeek] || dailyMemberThemes[1];

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

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${currentTheme.headline} – Rishta Matrimony</title>
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
              <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9; color: #e2e8f0;">Islamic Matchmaking & Matrimonial Service</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 35px 30px;">
              <p style="font-size: 18px; font-weight: 700; color: #1f4037; margin: 0 0 16px 0;">
                ${salutation}
              </p>

              <p style="font-size: 15px; line-height: 1.7; color: #4a5568; margin: 0 0 20px 0;">
                ${currentTheme.introNote}
              </p>

              <!-- Recommended Matches -->
              <div style="margin: 25px 0 15px;">
                <h3 style="margin: 0 0 14px; font-size: 16px; color: #166534;">
                  🎯 Top Curated ${targetGenderLabel} Matches:
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

              <!-- Dynamic Daily Tip -->
              <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 16px; margin: 25px 0 15px;">
                <strong style="color: #92400e; font-size: 14px;">💡 ${currentTheme.tipTitle}:</strong>
                <p style="margin: 6px 0 0; font-size: 13px; color: #78350f; line-height: 1.6;">
                  ${currentTheme.tipBody}
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

  return { subject: currentTheme.subject, html };
}

async function fetchRecipients(): Promise<NewsletterRecipient[]> {
  const recipients: NewsletterRecipient[] = [];
  const seenEmails = new Set<string>();
  const dayOfWeek = getISTDayOfWeek();

  // Fetch all profiles
  let allProfiles: ProfileRecord[] = [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles_data?select=id,name,gender,age,location,profession,education,caste,maslak,email,is_live,verification_status,created_at,admin_notes`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
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

  // 1. Separate profiles into Verified Live Members vs Pending/Unverified Registrations
  const verifiedMembersMap = new Map<string, ProfileRecord>();
  const pendingMembersMap = new Map<string, ProfileRecord>();

  for (const p of allProfiles) {
    const email = (p.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) continue;

    // Skip previously bounced or invalid member emails to protect sender reputation
    if (p.admin_notes && p.admin_notes.includes("[EMAIL_BOUNCED]")) {
      console.log(`[Bounce Protector] Profile #${p.id} (${email}) skipped due to previous bounce flag.`);
      continue;
    }

    // Pre-flight syntax and disposable domain check
    if (!isValidEmailFormat(email)) {
      console.warn(`[Pre-Flight Drop] Profile #${p.id} (${email}) has invalid syntax/domain. Skipped.`);
      continue;
    }

    const isVerified = (p.verification_status || "").toLowerCase() === "verified" && p.is_live === true;
    if (isVerified) {
      verifiedMembersMap.set(email, p);
    } else {
      pendingMembersMap.set(email, p);
    }
  }

  // 2. Verified Members: Receive personalized matching digest + 7-day dynamic rotation
  for (const [email, member] of verifiedMembersMap.entries()) {
    if (seenEmails.has(email)) continue;
    seenEmails.add(email);

    const userGender = (member.gender || "male").toLowerCase();
    const targetGender = userGender === "male" ? "female" : "male";
    const candidates = liveProfiles.filter(
      (c) => (c.gender || "").toLowerCase() === targetGender && c.id !== member.id
    );

    // Extract Location Tokens
    const memberLoc = (member.location || "").toLowerCase().replace(/,/g, " ");
    const locTokens = memberLoc
      .split(/\s+/)
      .filter((t) => t.length > 3 && !["near", "india", "road", "city"].includes(t));

    const regionalMatches = candidates.filter((c) => {
      const cLoc = (c.location || "").toLowerCase();
      return locTokens.some((tok) => cLoc.includes(tok));
    });

    // Education / Profession Matches (High Qualification Spotlight)
    const educationKeywords = ["doctor", "engineer", "mbbs", "md", "b.tech", "m.tech", "mba", "professor", "teacher", "ca", "software", "graduate"];
    const educationMatches = candidates.filter((c) => {
      const edu = (c.education || "").toLowerCase();
      const prof = (c.profession || "").toLowerCase();
      return educationKeywords.some((k) => edu.includes(k) || prof.includes(k));
    });

    // Newest profiles (Sort by ID desc)
    const newestMatches = [...candidates].sort((a, b) => b.id - a.id);

    // Dynamic Matching Sorting based on Day of Week:
    let selectedMatches: ProfileRecord[] = [];
    if (dayOfWeek === 1 && regionalMatches.length > 0) {
      // Monday: Regional priority
      const other = candidates.filter((c) => !regionalMatches.includes(c));
      selectedMatches = [...regionalMatches, ...other].slice(0, 3);
    } else if (dayOfWeek === 2 && educationMatches.length > 0) {
      // Tuesday: High Qualification priority
      const other = candidates.filter((c) => !educationMatches.includes(c));
      selectedMatches = [...educationMatches, ...other].slice(0, 3);
    } else if (dayOfWeek === 4) {
      // Thursday: Newest profiles added
      selectedMatches = newestMatches.slice(0, 3);
    } else {
      // Other days (Wed, Fri, Sat, Sun): Balanced regional + diverse profiles
      const other = candidates.filter((c) => !regionalMatches.includes(c));
      selectedMatches = [...regionalMatches, ...other].slice(0, 3);
    }

    // Generate dynamic member email
    const { subject, html } = buildMemberDigestHtml(member, selectedMatches, email, dayOfWeek);

    recipients.push({
      type: "member",
      email,
      name: member.name || "Member",
      subject,
      html,
      profileId: member.id,
      adminNotes: member.admin_notes,
    });
  }

  // 3. Pending/Unverified Profiles: receive visitor newsletter until approved/verified by admin
  for (const [email, pendingProfile] of pendingMembersMap.entries()) {
    if (seenEmails.has(email)) continue;
    seenEmails.add(email);

    const pendingName = pendingProfile.name || "Valued Member";
    const { subject, html } = buildVisitorNewsletterHtml(maleCount, femaleCount, email, dayOfWeek, pendingName);

    recipients.push({
      type: "visitor",
      email,
      name: pendingName,
      subject,
      html,
      profileId: pendingProfile.id,
      adminNotes: pendingProfile.admin_notes,
    });
  }

  // 4. Newsletter Subscribers: visitors who haven't registered or verified yet
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
        if (email && !seenEmails.has(email)) {
          // Pre-flight check: if subscriber email has invalid format/domain, auto-deactivate immediately
          if (!isValidEmailFormat(email)) {
            console.warn(`[Bounce Protector] Deactivating malformed subscriber email: ${email}`);
            deactivateNewsletterSubscriber(email, "Invalid syntax/domain");
            continue;
          }

          seenEmails.add(email);
          const { subject, html } = buildVisitorNewsletterHtml(maleCount, femaleCount, email, dayOfWeek);
          recipients.push({
            type: "visitor",
            email,
            name: "Valued Member",
            subject,
            html,
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
    const dayOfWeek = getISTDayOfWeek();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDayName = dayNames[dayOfWeek];

    const recipients = await fetchRecipients();
    const memberCount = recipients.filter((r) => r.type === "member").length;
    const visitorCount = recipients.filter((r) => r.type === "visitor").length;
    console.log(`[Cron Dispatcher] Day: ${currentDayName} (IST). Total: ${recipients.length} recipients (${memberCount} Members, ${visitorCount} Visitors).`);

    let successCount = 0;
    const errors: string[] = [];
    const bouncedList: { email: string; type: string; reason: string }[] = [];
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
            const recipientToHeader = rec.name && rec.name !== "Valued Member" && rec.name !== "Member" && rec.name !== "Respected Member"
              ? `"${rec.name.replace(/[<>"']/g, "").trim()}" <${rec.email}>`
              : rec.email;

            await transporter.sendMail({
              from: `Rishta Matrimony <${SENDER_EMAIL}>`,
              to: recipientToHeader,
              subject: rec.subject,
              html: rec.html,
              headers: {
                "List-Unsubscribe": `<mailto:${SENDER_EMAIL}?subject=Unsubscribe>`,
              },
            });
            successCount++;
          } catch (err: any) {
            const errMsg = err?.message || String(err);
            errors.push(`${rec.email}: ${errMsg}`);

            // Automatically detect hard bounces / invalid mailboxes and deactivate them in Supabase
            if (isFatalBounceError(err)) {
              console.warn(`[Bounce Detected] Fatal bounce for ${rec.email} (${rec.type}): ${errMsg}`);
              bouncedList.push({
                email: rec.email,
                type: rec.type,
                reason: errMsg,
              });

              if (rec.type === "visitor") {
                await deactivateNewsletterSubscriber(rec.email, errMsg);
              } else if (rec.type === "member" && rec.profileId) {
                await markMemberEmailBounced(rec.profileId, rec.adminNotes, errMsg);
              }
            }
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
        subject: `📊 [${currentDayName}] Daily Matrimonial Dispatch: ${successCount}/${recipients.length} Delivered (${bouncedList.length} Bounced/Cleaned)`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #2d3748;">
            <h2 style="color: #1f4037; margin-top: 0;">Daily Matrimonial Newsletter Report (${currentDayName})</h2>
            <p style="margin: 4px 0;"><strong>Execution Status:</strong> Completed</p>
            <p style="margin: 4px 0;"><strong>Scheduled Day:</strong> ${currentDayName} (IST)</p>
            <p style="margin: 4px 0;"><strong>Total Qualified Recipients:</strong> ${recipients.length}</p>
            <p style="margin: 4px 0;"><strong>Verified Members Delivered:</strong> ${memberCount}</p>
            <p style="margin: 4px 0;"><strong>Visitors / Pending Delivered:</strong> ${visitorCount}</p>
            <p style="margin: 4px 0;"><strong>Successfully Delivered:</strong> <span style="color: #15803d; font-weight: bold;">${successCount}</span></p>
            <p style="margin: 4px 0;"><strong>Total Errors/Rejections:</strong> ${errors.length}</p>
            <p style="margin: 4px 0;"><strong>Auto-Deactivated Bounced Addresses:</strong> <span style="color: ${bouncedList.length > 0 ? '#b91c1c' : '#15803d'}; font-weight: bold;">${bouncedList.length}</span></p>

            ${
              bouncedList.length > 0
                ? `
              <div style="margin: 20px 0; padding: 16px; background-color: #fef2f2; border: 1.5px solid #f87171; border-radius: 8px;">
                <strong style="color: #991b1b; font-size: 14px; display: block; margin-bottom: 6px;">
                  🛡️ Auto-Deactivated & Blacklisted Bounces (${bouncedList.length}):
                </strong>
                <p style="margin: 0 0 10px; font-size: 12px; color: #7f1d1d; line-height: 1.5;">
                  These addresses caused permanent delivery errors (such as Mailbox does not exist). The system has automatically deactivated them in Supabase to permanently protect your Gmail account (<strong>${SENDER_EMAIL}</strong>) from spam penalties or bans:
                </p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="background: #ffffff; border-radius: 6px; font-size: 12px; border: 1px solid #fecaca;">
                  <tr style="background: #fee2e2; color: #991b1b; font-weight: bold;">
                    <th align="left" style="padding: 6px 10px;">Email</th>
                    <th align="left" style="padding: 6px 10px;">Type</th>
                    <th align="left" style="padding: 6px 10px;">Reason</th>
                  </tr>
                  ${bouncedList
                    .map(
                      (b) => `
                    <tr style="border-bottom: 1px solid #fecaca;">
                      <td style="padding: 6px 10px; color: #1f2937; font-weight: 600;">${b.email}</td>
                      <td style="padding: 6px 10px; color: #4b5563;">${b.type}</td>
                      <td style="padding: 6px 10px; color: #b91c1c;">${b.reason}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </table>
              </div>
            `
                : `
              <div style="margin: 15px 0; padding: 12px; background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; color: #166534; font-size: 13px;">
                ✓ <strong>Sender Reputation Healthy:</strong> Zero permanent bounces detected today! All email addresses are clean and responsive.
              </div>
            `
            }

            ${
              errors.length > bouncedList.length
                ? `
              <div style="margin-top: 15px; font-size: 12px;">
                <strong>Temporary Errors (${errors.length - bouncedList.length}):</strong><br/>
                <span style="color: #6b7280;">${errors.filter((e) => !bouncedList.some((b) => e.startsWith(b.email))).join("<br/>")}</span>
              </div>
            `
                : ""
            }

            <p style="color: #718096; font-size: 12px; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
              Automated 7-day dynamic rotation & bounce protection by Vercel Cloud Cron at 9:00 AM IST.
            </p>
          </div>
        `,
      });
    } catch (adminErr) {
      console.warn("Could not send admin report:", adminErr);
    }

    return res.status(200).json({
      success: true,
      day: currentDayName,
      message: `Dispatched ${successCount} emails (${memberCount} Members, ${visitorCount} Visitors). Auto-deactivated ${bouncedList.length} bounced addresses.`,
      totalRecipients: recipients.length,
      memberCount,
      visitorCount,
      successCount,
      failedCount: errors.length,
      bouncedCount: bouncedList.length,
      bouncedList,
    });
  } catch (err: any) {
    console.error("Cron dispatcher fatal error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
