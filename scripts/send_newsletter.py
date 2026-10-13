import os
import sys
import ssl
import json
import smtplib
import time
import urllib.request
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configuration
SENDER_EMAIL = "info.rista2025@gmail.com"
APP_PASSWORD = "oeoysisyrjvvrwyy"
ADMIN_EMAIL = "info.rista2025@gmail.com"

SUPABASE_URL = "https://rxlzlkcdszulyetcxxih.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bHpsa2Nkc3p1bHlldGN4eGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTAzODIsImV4cCI6MjA3NTI2NjM4Mn0.PXcKNOiJlQr_BSqPZKIGTQYKK-e6Y5obVg7WPJm17hM"

UNSUBSCRIBE_FILE = os.path.join(os.path.dirname(__file__), "unsubscribed.txt")

def get_unsubscribed_list():
    """Reads emails that have opted out of the newsletter."""
    if not os.path.exists(UNSUBSCRIBE_FILE):
        return set()
    with open(UNSUBSCRIBE_FILE, "r", encoding="utf-8") as f:
        return set(line.strip().lower() for line in f if line.strip())

def build_visitor_newsletter_html(male_count: int, female_count: int, recipient_email: str) -> str:
    unsub_mailto = f"mailto:{SENDER_EMAIL}?subject=Unsubscribe%20Newsletter&body=Please%20unsubscribe%20my%20email:%20{recipient_email}"
    total_count = male_count + female_count
    return f"""<!DOCTYPE html>
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
                      <strong style="color: #166534; font-size: 16px; display: block; margin-top: 4px;">Live Verified Community ({total_count}+ Profiles)</strong>
                    </div>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
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

def build_member_digest_html(member: dict, matches: list, recipient_email: str) -> str:
    unsub_mailto = f"mailto:{SENDER_EMAIL}?subject=Unsubscribe%20Newsletter&body=Please%20unsubscribe%20my%20email:%20{recipient_email}"
    user_name = member.get("name") or "Respected Member"
    user_gender = (member.get("gender") or "male").lower()
    target_gender_label = "Bride" if user_gender == "male" else "Groom"
    location = member.get("location") or "Your Region"

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

    return f"""<!DOCTYPE html>
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
              <h2 style="margin-top: 0; color: #1f4037; font-size: 21px;">Assalamu Alaikum {user_name},</h2>
              <p style="font-size: 15px; line-height: 1.7; color: #4a5568;">
                Here are your latest verified <strong>{target_gender_label} proposals</strong> recommended specifically for your preferences and region (<strong>{location}</strong>):
              </p>

              <!-- Recommended Matches -->
              <div style="margin: 25px 0 15px;">
                <h3 style="margin: 0 0 14px; font-size: 16px; color: #166534;">
                  🎯 Top Recommended {target_gender_label} Matches For You:
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

def fetch_recipients():
    unsubscribed = get_unsubscribed_list()
    seen = set()
    recipients = []

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }

    # Fetch all profiles
    all_profiles = []
    try:
        url = f"{SUPABASE_URL}/rest/v1/profiles_data?select=id,name,gender,age,location,profession,education,email,is_live,verification_status"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            all_profiles = json.loads(resp.read().decode())
    except Exception as e:
        print(f"Error reading profiles_data: {e}")

    live_profiles = [p for p in all_profiles if p.get("is_live") is True]
    male_count = sum(1 for p in live_profiles if (p.get("gender") or "").lower() == "male")
    female_count = sum(1 for p in live_profiles if (p.get("gender") or "").lower() == "female")

    # Registered Profiles
    registered_map = {}
    for p in all_profiles:
        email = (p.get("email") or "").strip().lower()
        if email and "@" in email:
            registered_map[email] = p

    for email, member in registered_map.items():
        if email in seen or email in unsubscribed:
            continue
        seen.add(email)

        user_gender = (member.get("gender") or "male").lower()
        target_gender = "female" if user_gender == "male" else "male"
        candidates = [c for c in live_profiles if (c.get("gender") or "").lower() == target_gender and c.get("id") != member.get("id")]

        member_loc = (member.get("location") or "").lower().replace(",", " ")
        loc_tokens = [t for t in member_loc.split() if len(t) > 3 and t not in ["near", "india", "road", "city"]]

        regional_matches = [c for c in candidates if any(tok in (c.get("location") or "").lower() for tok in loc_tokens)]
        other_matches = [c for c in candidates if c not in regional_matches]
        selected_matches = (regional_matches + other_matches)[:3]

        subject = f"✨ New Verified Matches in {member.get('location') or 'Your Region'} – Rishta Matrimony" if regional_matches else "✨ Recommended Verified Matches For You – Rishta Matrimony"
        html = build_member_digest_html(member, selected_matches, email)

        recipients.append({
            "type": "member",
            "email": email,
            "name": member.get("name") or "Member",
            "subject": subject,
            "html": html
        })

    # Newsletter Subscribers (visitors)
    try:
        url = f"{SUPABASE_URL}/rest/v1/newsletter_subscribers?select=email&status=eq.active"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            news_rows = json.loads(resp.read().decode())
            for r in news_rows:
                email = (r.get("email") or "").strip().lower()
                if email and "@" in email and email not in seen and email not in unsubscribed:
                    seen.add(email)
                    recipients.append({
                        "type": "visitor",
                        "email": email,
                        "name": "Valued Member",
                        "subject": f"🌸 Find Your Righteous Partner – {male_count + female_count}+ Verified Profiles on Rishta Matrimony",
                        "html": build_visitor_newsletter_html(male_count, female_count, email)
                    })
    except Exception as e:
        print(f"Error reading newsletter_subscribers: {e}")

    return recipients

def send_newsletter(is_live=False):
    recipients = fetch_recipients()
    member_count = sum(1 for r in recipients if r["type"] == "member")
    visitor_count = sum(1 for r in recipients if r["type"] == "visitor")
    print(f"Found {len(recipients)} recipients ({member_count} Registered Members, {visitor_count} Newsletter Visitors).")

    if not recipients:
        print("No recipients found.")
        return

    context = ssl.create_default_context()
    
    if not is_live:
        print(f"TEST RUN MODE: Sending test newsletter only to Admin ({ADMIN_EMAIL})")
        targets = [{
            "type": "member",
            "email": ADMIN_EMAIL,
            "name": "Admin",
            "subject": f"[TEST] Daily Digest & Recommended Matches",
            "html": recipients[0]["html"]
        }]
    else:
        print(f"LIVE MODE: Dispatching to all {len(recipients)} recipients...")
        targets = recipients

    success_count = 0
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        for r in targets:
            try:
                msg = MIMEMultipart("alternative")
                msg["Subject"] = r["subject"]
                msg["From"] = f"Rishta Matrimony <{SENDER_EMAIL}>"
                msg["To"] = r["email"]
                msg["List-Unsubscribe"] = f"<mailto:{SENDER_EMAIL}?subject=Unsubscribe>"
                msg.attach(MIMEText(r["html"], "html"))
                
                server.sendmail(SENDER_EMAIL, r["email"], msg.as_string())
                success_count += 1
                print(f"[{r['type'].upper()}] Sent successfully to: {r['email']}")
                
                # Human-like delay between emails to protect sender reputation
                time.sleep(2.5)
            except Exception as e:
                print(f"Failed to send to {r['email']}: {e}")

    print(f"Newsletter run completed! {success_count}/{len(targets)} emails sent.")

if __name__ == "__main__":
    is_live = "--live" in sys.argv
    send_newsletter(is_live=is_live)
