import os
import sys
import ssl
import json
import re
import smtplib
import time
import urllib.request
import urllib.parse
from datetime import datetime, timezone, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configuration
SENDER_EMAIL = "info.rista2025@gmail.com"
APP_PASSWORD = "oeoysisyrjvvrwyy"
ADMIN_EMAIL = "info.rista2025@gmail.com"

SUPABASE_URL = "https://rxlzlkcdszulyetcxxih.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bHpsa2Nkc3p1bHlldGN4eGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTAzODIsImV4cCI6MjA3NTI2NjM4Mn0.PXcKNOiJlQr_BSqPZKIGTQYKK-e6Y5obVg7WPJm17hM"

UNSUBSCRIBE_FILE = os.path.join(os.path.dirname(__file__), "unsubscribed.txt")

def is_valid_email_format(email: str) -> bool:
    if not email or not isinstance(email, str):
        return False
    clean = email.strip().lower()
    email_regex = r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$"
    if not re.match(email_regex, clean):
        return False
    parts = clean.split("@")
    if len(parts) != 2:
        return False
    user, domain = parts
    if not user or not domain:
        return False
    blocked = [
        "example.com", "example.org", "test.com", "test.in",
        "dummy.com", "fake.com", "sample.com", "mailinator.com",
        "tempmail.com", "10minutemail.com", "guerrillamail.com"
    ]
    if domain in blocked:
        return False
    domain_parts = domain.split(".")
    if len(domain_parts) < 2 or len(domain_parts[-1]) < 2:
        return False
    return True

def is_fatal_bounce_error(err) -> bool:
    if not err:
        return False
    err_str = str(err).lower()
    bounce_patterns = [
        "550", "551", "552", "553", "554",
        "user unknown", "user not found", "does not exist",
        "no such user", "recipient address rejected", "invalid recipient",
        "address rejected", "mailbox unavailable", "mailbox not found",
        "undeliverable", "relay access denied", "domain not found",
        "host or domain name not found", "bad destination mailbox",
        "disabled", "inactive user"
    ]
    return any(p in err_str for p in bounce_patterns)

def deactivate_newsletter_subscriber(email: str, reason: str):
    try:
        url = f"{SUPABASE_URL}/rest/v1/newsletter_subscribers?email=eq.{urllib.parse.quote(email)}"
        payload = json.dumps({"status": "bounced", "updated_at": datetime.now(timezone.utc).isoformat()}).encode("utf-8")
        req = urllib.request.Request(url, data=payload, method="PATCH", headers={
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Prefer": "return=minimal"
        })
        with urllib.request.urlopen(req) as resp:
            print(f"[Bounce Protector] Successfully deactivated {email} in newsletter_subscribers.")
    except Exception as e:
        print(f"[Bounce Protector] Error deactivating {email}: {e}")

def mark_member_email_bounced(profile_id: int, current_notes: str, reason: str):
    try:
        clean_reason = reason.replace('"', "'").replace("\n", " ")[:80]
        note_tag = f"[EMAIL_BOUNCED: {clean_reason}]"
        updated_notes = f"{current_notes} | {note_tag}" if current_notes else note_tag
        url = f"{SUPABASE_URL}/rest/v1/profiles_data?id=eq.{profile_id}"
        payload = json.dumps({"admin_notes": updated_notes, "updated_at": datetime.now(timezone.utc).isoformat()}).encode("utf-8")
        req = urllib.request.Request(url, data=payload, method="PATCH", headers={
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Prefer": "return=minimal"
        })
        with urllib.request.urlopen(req) as resp:
            print(f"[Bounce Protector] Flagged profile #{profile_id} as [EMAIL_BOUNCED].")
    except Exception as e:
        print(f"[Bounce Protector] Error flagging profile #{profile_id}: {e}")

def get_ist_day_of_week():
    """Returns day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday) in Indian Standard Time (IST)."""
    ist = timezone(timedelta(hours=5, minutes=30))
    now_ist = datetime.now(ist)
    # Python weekday(): 0 = Mon, 6 = Sun -> convert to JS getDay(): 0 = Sun, 1 = Mon, ..., 6 = Sat
    py_weekday = now_ist.weekday()
    return (py_weekday + 1) % 7

def get_unsubscribed_list():
    """Reads emails that have opted out of the newsletter."""
    if not os.path.exists(UNSUBSCRIBE_FILE):
        return set()
    with open(UNSUBSCRIBE_FILE, "r", encoding="utf-8") as f:
        return set(line.strip().lower() for line in f if line.strip())

def build_visitor_newsletter_html(male_count: int, female_count: int, recipient_email: str, day_of_week: int, recipient_name: str = "Valued Member"):
    unsub_mailto = f"mailto:{SENDER_EMAIL}?subject=Unsubscribe%20Newsletter&body=Please%20unsubscribe%20my%20email:%20${recipient_email}"
    total_count = male_count + female_count

    daily_themes = {
        0: {
            "subject": "🌟 Candidates Added This Week: Take a Sneak Peek on Rishta Matrimony",
            "badge": "Weekend Roundup",
            "headline": "Meet New Verified Candidates Added This Week",
            "intro": "Every single week, dozens of serious and verified Muslim candidates join Rishta Matrimony to complete half their deen. Here is your weekly community highlight.",
            "box_title": f"🌟 Active Community: {total_count}+ Verified Candidates",
            "box_body": f"With <strong>{male_count}+ verified grooms</strong> and <strong>{female_count}+ verified brides</strong> currently active on our platform, families across India are finding compatible proposals every day."
        },
        1: {
            "subject": "⚡ Find Your Righteous Partner: Register in Under 2 Minutes (100% Free)",
            "badge": "Fresh Week Start",
            "headline": "Start Your Matrimonial Journey in Under 2 Minutes",
            "intro": "Don't delay completing half your deen. Creating your matrimonial profile on Rishta Matrimony is completely free, straightforward, and takes less than 2 minutes.",
            "box_title": "⚡ Fast, Free & Frictionless Registration",
            "box_body": "No complex paperwork or hidden charges. Simply provide your basic biodata and partner preferences, and our team will get your profile verified quickly."
        },
        2: {
            "subject": "🛡️ 100% Modest & Privacy-Protected: How Rishta Matrimony Protects You",
            "badge": "Privacy Guarantee",
            "headline": "Your Family's Privacy & Modesty Always Comes First",
            "intro": "In authentic Islamic matchmaking, modesty (haya) and privacy are sacred. Unlike casual dating or open social apps, Rishta Matrimony safeguards every detail.",
            "box_title": "🔒 Four Pillars of Privacy & Security",
            "box_body": "• Photos are protected and not publicly broadcast.<br/>• Personal phone numbers are never shared without verification.<br/>• Zero Google indexing — profiles remain private.<br/>• Direct family & wali involvement."
        },
        3: {
            "subject": f"📊 {total_count}+ Verified Grooms & Brides Awaiting Righteous Matches – Rishta Matrimony",
            "badge": "Community Growth",
            "headline": "A Growing Community of Serious Muslim Families",
            "intro": "Finding a compatible life partner requires genuine, verified options. Our verified network connects families across various professions, education levels, and regions.",
            "box_title": f"📊 Live Community Numbers: {total_count}+ Profiles",
            "box_body": f"Currently hosting <strong>{male_count}+ Verified Grooms</strong> and <strong>{female_count}+ Verified Brides</strong>, verified personally by our administrative team."
        },
        4: {
            "subject": "📲 Zero Fake Profiles: Personally Verified by Admin on WhatsApp – Rishta Matrimony",
            "badge": "Verified Trust",
            "headline": "Authentic Connections: Every Profile Personally Verified",
            "intro": "Tired of duplicate or inactive profiles on other websites? Rishta Matrimony enforces a strict manual verification policy before any biodata goes live.",
            "box_title": "✓ Personal WhatsApp Verification Process",
            "box_body": "Our administrative team reaches out directly on WhatsApp to verify identity, biodata details, and partner expectations. Need help filling your form? Our helpline is available at <strong>+91 9128719875</strong>."
        },
        5: {
            "subject": "🕌 Jumu'ah Reflection: The Sacred Virtues of Nikah in Islam",
            "badge": "Jumu'ah Mubarak",
            "headline": "The Noble Sunnah of Completing Half Your Deen",
            "intro": "On this blessed day of Jumu'ah, take a mindful step towards fulfilling the Prophet's ﷺ noble guidance on marriage, modesty, and righteous partnership.",
            "box_title": "📖 Hadith on the Sanctity of Marriage",
            "box_body": "<em>\"When a person marries, they have completed half of their religion, so let them fear Allah regarding the remaining half.\"</em> [Al-Bayhaqi]<br/><br/>May Allah SWT bless your noble intentions and grant you a righteous life partner."
        },
        6: {
            "subject": "💡 Tired of Traditional Marriage Brokers? Discover Transparent Matchmaking",
            "badge": "Modern & Transparent",
            "headline": "Dignified, Modern & Transparent Islamic Matchmaking",
            "intro": "Traditional matchmakers often involve high brokerage fees, long delays, and unclear details. Rishta Matrimony brings transparency, dignity, and direct family access.",
            "box_title": "🌟 The Rishta Matrimony Advantage",
            "box_body": "• Direct guardian & family contact access.<br/>• Transparent, affordable plans (starting at just ₹48).<br/>• Self-paced search tailored to your age, education, and maslak."
        }
    }

    theme = daily_themes.get(day_of_week, daily_themes[1])

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{theme['headline']} – Rishta Matrimony</title>
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
              <div style="display: inline-block; background: #e6f4ea; color: #137333; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; margin-bottom: 12px;">
                {theme['badge']}
              </div>

              <h2 style="margin-top: 0; color: #1f4037; font-size: 22px; line-height: 1.3;">{theme['headline']}</h2>
              <p style="font-size: 15px; line-height: 1.7; color: #4a5568;">
                {theme['intro']}
              </p>

              <!-- Daily Thematic Highlight Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 1.5px solid #86efac; border-radius: 10px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <strong style="color: #166534; font-size: 16px; display: block; margin-bottom: 8px;">{theme['box_title']}</strong>
                    <div style="font-size: 14px; line-height: 1.7; color: #15803d;">
                      {theme['box_body']}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Community Counts Overview -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0;">
                <tr>
                  <td width="50%" align="center" style="padding: 12px; background: #ffffff; border-radius: 8px; border: 1px solid #bbf7d0;">
                    <div style="font-size: 22px; font-weight: 800; color: #15803d;">{male_count}+</div>
                    <div style="font-size: 13px; color: #4a5568; font-weight: 600;">Verified Grooms</div>
                  </td>
                  <td width="10"></td>
                  <td width="50%" align="center" style="padding: 12px; background: #ffffff; border-radius: 8px; border: 1px solid #bbf7d0;">
                    <div style="font-size: 22px; font-weight: 800; color: #15803d;">{female_count}+</div>
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
                <a href="{unsub_mailto}" style="color: #e53e3e; font-size: 12px; text-decoration: underline;">
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
</html>"""
    return theme["subject"], html

def build_member_digest_html(member: dict, matches: list, recipient_email: str, day_of_week: int):
    unsub_mailto = f"mailto:{SENDER_EMAIL}?subject=Unsubscribe%20Newsletter&body=Please%20unsubscribe%20my%20email:%20${recipient_email}"
    user_name = member.get("name") or "Respected Member"
    user_gender = (member.get("gender") or "male").lower()
    target_gender_label = "Bride" if user_gender == "male" else "Groom"
    location = member.get("location") or "Your Region"

    daily_member_themes = {
        0: {
            "subject": f"💎 {user_name}, Ready to Connect? Unlock Verified Contacts for Just ₹48 – Rishta Matrimony",
            "badge": "Sunday Spotlight: Direct Connect",
            "headline": "Connect Directly with Your Chosen Proposals Today",
            "intro": f"Assalamu Alaikum <strong>{user_name}</strong>. Take a moment this Sunday to review your recommended matches. Unlock verified direct contacts for just ₹48, or upgrade to our full Premium Plan for unlimited 2-month access.",
            "tip_title": "💎 Fast-Track Your Matrimonial Search",
            "tip_body": "Interested in one candidate? Use our single-profile unlock for ₹48. Want unlimited contact access and Page 1 featured placement? Choose our ₹491 Premium Membership."
        },
        1: {
            "subject": f"📍 {user_name}, Top Recommended {target_gender_label} Matches in {location} – Rishta Matrimony",
            "badge": "Regional & Local Focus",
            "headline": f"Top Recommended {target_gender_label} Proposals in {location} & Nearby",
            "intro": f"Assalamu Alaikum <strong>{user_name}</strong>. Start your week by exploring compatible proposals located in or around <strong>{location}</strong>. Local connections make family meetings and background verification seamless.",
            "tip_title": "📍 The Power of Regional Compatibility",
            "tip_body": "Proposals from your own state or neighboring districts often share familiar cultural, educational, and linguistic traditions, making compatibility easier for both families."
        },
        2: {
            "subject": f"🎓 {user_name}, Highly Qualified Matches: Engineers, Doctors & Graduates – Rishta Matrimony",
            "badge": "Education & Career Spotlight",
            "headline": f"Highly Educated & Professional {target_gender_label} Candidates",
            "intro": f"Assalamu Alaikum <strong>{user_name}</strong>. Compatibility in education and profession brings mutual understanding. Here are verified candidates with strong academic and professional backgrounds curated for you.",
            "tip_title": "🎓 Academic & Professional Profiles",
            "tip_body": "Our database features verified engineers, doctors, professors, business professionals, and university graduates seeking righteous life partners."
        },
        3: {
            "subject": f"⭐ {user_name}, Profile Activity & Views: Boost Your Visibility – Rishta Matrimony",
            "badge": "Profile Health & Visibility",
            "headline": "Boost Your Profile Rank & Check Profile Views",
            "intro": f"Assalamu Alaikum <strong>{user_name}</strong>. Active profiles are recommended higher in our matrimonial algorithm. Log in to your dashboard to see who viewed or shortlisted your biodata recently.",
            "tip_title": "⭐ Activity Boost Guarantee",
            "tip_body": "Members who log in at least once a week receive up to <strong>3x more interest requests</strong>. Keep your preferences updated to receive the best proposals."
        },
        4: {
            "subject": f"✨ {user_name}, Fresh Proposals for You: Newly Verified Candidates – Rishta Matrimony",
            "badge": "Newest Weekly Arrivals",
            "headline": f"Newly Verified {target_gender_label} Profiles Added This Week",
            "intro": f"Assalamu Alaikum <strong>{user_name}</strong>. Every day brings new hopes and fresh proposals. Here are recently approved and verified profiles that match your gender and lifestyle preferences.",
            "tip_title": "✨ Fresh Proposals Every Week",
            "tip_body": "Be among the first to express interest in newly approved profiles. Early inquiries receive the highest response rates from prospective families."
        },
        5: {
            "subject": f"🕌 Jumu'ah Mubarak {user_name}! Curated Proposals for a Blessed Nikah – Rishta Matrimony",
            "badge": "Jumu'ah Mubarak",
            "headline": "A Blessed Day to Advance Your Noble Intentions of Nikah",
            "intro": f"Assalamu Alaikum <strong>{user_name}</strong>. On this blessed Jumu'ah, we present curated, modest <strong>{target_gender_label} proposals</strong> upholding authentic Islamic principles.",
            "tip_title": "📖 Islamic Principle of Compatibility",
            "tip_body": "<em>\"A woman is married for four things: her wealth, her family status, her beauty, and her religion. So you should marry the religious woman; otherwise you will be a loser.\"</em> [Bukhari]"
        },
        6: {
            "subject": f"👨‍👩‍👧‍👦 {user_name}, Weekend Family Review: Curated Matches for You – Rishta Matrimony",
            "badge": "Weekend Family Digest",
            "headline": "Review Compatible Proposals with Your Family Today",
            "intro": f"Assalamu Alaikum <strong>{user_name}</strong>. Weekends provide the ideal time for families to sit together, review biodatas, and discuss prospects with mutual consultation and care.",
            "tip_title": "👨‍👩‍👧‍👦 Family Consultation (Mashwarah)",
            "tip_body": "Share suitable profiles with your parents or guardians this weekend. Discussing compatibility together brings clarity and barakah into the matrimonial decision."
        }
    }
    theme = daily_member_themes.get(day_of_week, daily_member_themes[1])
    match_cards_html = ""
    for m in matches:
        m_name = m.get("name") or "Verified Candidate"
        m_age = m.get("age") or "N/A"
        m_prof = m.get("profession") or "Professional"
        m_edu = m.get("education") or "Graduate"
        m_loc = m.get("location") or "India"

        match_cards_html += f"""
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; margin-bottom: 14px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
          <tr>
            <td style="padding: 16px 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <span style="background: #e6f4ea; color: #137333; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">
                      ✓ Verified {target_gender_label}
                    </span>
                  </td>
                  <td align="right" style="font-size: 12px; color: #718096;">
                    📍 {m_loc}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 8px;">
                    <h4 style="margin: 0 0 6px; font-size: 16px; color: #1f4037;">{m_name}</h4>
                    <p style="margin: 0 0 12px; font-size: 13px; color: #4a5568; line-height: 1.6;">
                      • <strong>Age:</strong> {m_age} yrs &nbsp;|&nbsp; <strong>Profession:</strong> {m_prof}<br/>
                      • <strong>Education:</strong> {m_edu}
                    </p>
                    <a href="https://rishtamatrimony.vercel.app/member/login" style="background: #1f4037; color: #ffffff; text-decoration: none; padding: 8px 18px; font-size: 12px; font-weight: 600; border-radius: 6px; display: inline-block;">
                      View Biodata & Request Contact →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>"""

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{theme['headline']} – Rishta Matrimony</title>
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
              <div style="display: inline-block; background: #e6f4ea; color: #137333; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; margin-bottom: 12px;">
                {theme['badge']}
              </div>

              <h2 style="margin-top: 0; color: #1f4037; font-size: 21px; line-height: 1.3;">{theme['headline']}</h2>
              <p style="font-size: 15px; line-height: 1.7; color: #4a5568;">
                {theme['intro']}
              </p>

              <!-- Recommended Matches -->
              <div style="margin: 25px 0 15px;">
                <h3 style="margin: 0 0 14px; font-size: 16px; color: #166534;">
                  🎯 Top Curated {target_gender_label} Matches:
                </h3>
                {match_cards_html}
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
                <strong style="color: #92400e; font-size: 14px;">💡 {theme['tip_title']}:</strong>
                <p style="margin: 6px 0 0; font-size: 13px; color: #78350f; line-height: 1.6;">
                  {theme['tip_body']}
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
                <a href="{unsub_mailto}" style="color: #e53e3e; font-size: 12px; text-decoration: underline;">
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
</html>"""
    return theme["subject"], html

def fetch_recipients():
    unsubscribed = get_unsubscribed_list()
    seen = set()
    recipients = []
    day_of_week = get_ist_day_of_week()

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }

    # Fetch all profiles
    all_profiles = []
    try:
        url = f"{SUPABASE_URL}/rest/v1/profiles_data?select=id,name,gender,age,location,profession,education,caste,maslak,email,is_live,verification_status,created_at,admin_notes"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            all_profiles = json.loads(resp.read().decode())
    except Exception as e:
        print(f"Error reading profiles_data: {e}")

    live_profiles = [p for p in all_profiles if p.get("is_live") is True]
    male_count = sum(1 for p in live_profiles if (p.get("gender") or "").lower() == "male")
    female_count = sum(1 for p in live_profiles if (p.get("gender") or "").lower() == "female")

    # 1. Separate profiles into Verified Live Members vs Pending/Unverified Registrations
    verified_map = {}
    pending_map = {}
    for p in all_profiles:
        email = (p.get("email") or "").strip().lower()
        if not email or "@" not in email:
            continue

        # Skip previously bounced emails
        if p.get("admin_notes") and "[EMAIL_BOUNCED]" in p.get("admin_notes"):
            print(f"[Bounce Protector] Profile #{p.get('id')} ({email}) skipped due to previous bounce.")
            continue

        if not is_valid_email_format(email):
            print(f"[Pre-Flight Drop] Profile #{p.get('id')} ({email}) skipped due to invalid email format.")
            continue

        is_verified = (p.get("verification_status") or "").lower() == "verified" and p.get("is_live") is True
        if is_verified:
            verified_map[email] = p
        else:
            pending_map[email] = p

    # 2. Verified Members: Receive personalized matching digest + 7-day dynamic rotation
    for email, member in verified_map.items():
        if email in seen or email in unsubscribed:
            continue
        seen.add(email)

        user_gender = (member.get("gender") or "male").lower()
        target_gender = "female" if user_gender == "male" else "male"
        candidates = [c for c in live_profiles if (c.get("gender") or "").lower() == target_gender and c.get("id") != member.get("id")]

        # Location matching
        member_loc = (member.get("location") or "").lower().replace(",", " ")
        loc_tokens = [t for t in member_loc.split() if len(t) > 3 and t not in ["near", "india", "road", "city"]]

        regional_matches = [c for c in candidates if any(tok in (c.get("location") or "").lower() for tok in loc_tokens)]

        # Education / Profession Matching
        education_keywords = ["doctor", "engineer", "mbbs", "md", "b.tech", "m.tech", "mba", "professor", "teacher", "ca", "software", "graduate"]
        education_matches = [
            c for c in candidates
            if any(k in (c.get("education") or "").lower() or k in (c.get("profession") or "").lower() for k in education_keywords)
        ]

        # Newest matches
        newest_matches = sorted(candidates, key=lambda x: x.get("id", 0), reverse=True)

        # Dynamic Matching Sorting based on Day of Week:
        if day_of_week == 1 and regional_matches:
            # Monday: Regional priority
            other = [c for c in candidates if c not in regional_matches]
            selected_matches = (regional_matches + other)[:3]
        elif day_of_week == 2 and education_matches:
            # Tuesday: Qualification priority
            other = [c for c in candidates if c not in education_matches]
            selected_matches = (education_matches + other)[:3]
        elif day_of_week == 4:
            # Thursday: Newest profiles
            selected_matches = newest_matches[:3]
        else:
            other = [c for c in candidates if c not in regional_matches]
            selected_matches = (regional_matches + other)[:3]

        subject, html = build_member_digest_html(member, selected_matches, email, day_of_week)

        recipients.append({
            "type": "member",
            "email": email,
            "name": member.get("name") or "Member",
            "subject": subject,
            "html": html,
            "profile_id": member.get("id"),
            "admin_notes": member.get("admin_notes")
        })

    # 3. Pending/Unverified Profiles: receive visitor newsletter until approved/verified by admin
    for email, pending_profile in pending_map.items():
        if email in seen or email in unsubscribed:
            continue
        seen.add(email)

        pending_name = pending_profile.get("name") or "Valued Member"
        subject, html = build_visitor_newsletter_html(male_count, female_count, email, day_of_week, recipient_name=pending_name)

        recipients.append({
            "type": "visitor",
            "email": email,
            "name": pending_name,
            "subject": subject,
            "html": html,
            "profile_id": pending_profile.get("id"),
            "admin_notes": pending_profile.get("admin_notes")
        })

    # 4. Newsletter Subscribers (visitors)
    try:
        url = f"{SUPABASE_URL}/rest/v1/newsletter_subscribers?select=email&status=eq.active"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            news_rows = json.loads(resp.read().decode())
            for r in news_rows:
                email = (r.get("email") or "").strip().lower()
                if email and email not in seen and email not in unsubscribed:
                    if not is_valid_email_format(email):
                        print(f"[Bounce Protector] Auto-deactivating invalid subscriber email: {email}")
                        deactivate_newsletter_subscriber(email, "Invalid format/domain")
                        continue

                    seen.add(email)
                    subject, html = build_visitor_newsletter_html(male_count, female_count, email, day_of_week)
                    recipients.append({
                        "type": "visitor",
                        "email": email,
                        "name": "Valued Member",
                        "subject": subject,
                        "html": html
                    })
    except Exception as e:
        print(f"Error reading newsletter_subscribers: {e}")

    return recipients

def send_newsletter(is_live=False):
    day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    day_of_week = get_ist_day_of_week()
    current_day_name = day_names[day_of_week]

    recipients = fetch_recipients()
    member_count = sum(1 for r in recipients if r["type"] == "member")
    visitor_count = sum(1 for r in recipients if r["type"] == "visitor")
    print(f"[{current_day_name} IST] Found {len(recipients)} recipients ({member_count} Registered Members, {visitor_count} Newsletter Visitors).")

    if not recipients:
        print("No recipients found.")
        return

    context = ssl.create_default_context()
    
    if not is_live:
        print(f"TEST RUN MODE: Sending test newsletter only to Admin ({ADMIN_EMAIL}) for {current_day_name}")
        targets = [{
            "type": "member",
            "email": ADMIN_EMAIL,
            "name": "Admin",
            "subject": f"[TEST {current_day_name}] {recipients[0]['subject']}",
            "html": recipients[0]["html"]
        }]
    else:
        print(f"LIVE MODE: Dispatching to all {len(recipients)} recipients...")
        targets = recipients

    success_count = 0
    bounced_count = 0
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        for r in targets:
            try:
                msg = MIMEMultipart("alternative")
                msg["Subject"] = r["subject"]
                msg["From"] = f"Rishta Matrimony <{SENDER_EMAIL}>"
                msg["To"] = f'"{r["name"]}" <{r["email"]}>' if r.get("name") and r["name"] not in ["Valued Member", "Member", "Respected Member"] else r["email"]
                msg["List-Unsubscribe"] = f"<mailto:{SENDER_EMAIL}?subject=Unsubscribe>"
                msg.attach(MIMEText(r["html"], "html"))
                
                server.sendmail(SENDER_EMAIL, r["email"], msg.as_string())
                success_count += 1
                print(f"[{r['type'].upper()}] Sent successfully to: {r['email']}")
                
                # Human-like delay between emails to protect sender reputation
                time.sleep(2.5)
            except Exception as e:
                err_str = str(e)
                print(f"Failed to send to {r['email']}: {err_str}")
                if is_fatal_bounce_error(err_str):
                    bounced_count += 1
                    print(f"[Bounce Alert] Fatal bounce detected for {r['email']}. Deactivating...")
                    if r.get("type") == "visitor":
                        deactivate_newsletter_subscriber(r["email"], err_str)
                    elif r.get("type") == "member" and r.get("profile_id"):
                        mark_member_email_bounced(r["profile_id"], r.get("admin_notes", ""), err_str)

    print(f"Newsletter run completed! {success_count}/{len(targets)} sent. ({bounced_count} bounced/deactivated) for {current_day_name}.")

if __name__ == "__main__":
    is_live = "--live" in sys.argv
    send_newsletter(is_live=is_live)
