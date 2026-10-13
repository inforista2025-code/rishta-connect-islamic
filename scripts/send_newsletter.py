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

def fetch_subscribers():
    """Fetches unique valid recipient emails from Supabase profiles_data and newsletter_subscribers tables, skipping unsubscribed ones."""
    unsubscribed = get_unsubscribed_list()
    seen = set()
    subscribers = []

    # 1. Fetch from profiles_data (registered members)
    try:
        endpoint_profiles = f"{SUPABASE_URL}/rest/v1/profiles_data?select=name,email&email=not.is.null"
        req = urllib.request.Request(endpoint_profiles, headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json"
        })
        with urllib.request.urlopen(req) as resp:
            rows = json.loads(resp.read().decode())
            for r in rows:
                email = (r.get("email") or "").strip().lower()
                name = (r.get("name") or "Member").strip()
                if email and "@" in email and email not in seen and email not in unsubscribed:
                    seen.add(email)
                    subscribers.append({"name": name, "email": email})
    except Exception as e:
        print(f"Note on fetching profiles_data: {e}")

    # 2. Fetch from newsletter_subscribers (website visitors)
    try:
        endpoint_news = f"{SUPABASE_URL}/rest/v1/newsletter_subscribers?select=email&status=eq.active"
        req = urllib.request.Request(endpoint_news, headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json"
        })
        with urllib.request.urlopen(req) as resp:
            rows = json.loads(resp.read().decode())
            for r in rows:
                email = (r.get("email") or "").strip().lower()
                if email and "@" in email and email not in seen and email not in unsubscribed:
                    seen.add(email)
                    subscribers.append({"name": "Valued Member", "email": email})
    except Exception as e:
        # Table might not exist yet if user hasn't run migration
        pass

    return subscribers

def build_newsletter_html(user_name="Valued Member", recipient_email=""):
    unsub_mailto = f"mailto:{SENDER_EMAIL}?subject=Unsubscribe%20Newsletter&body=Please%20unsubscribe%20my%20email:%20{recipient_email}"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Rishta Matrimony Daily Digest</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2d3748;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f5f0; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1f4037, #2c7a7b); padding: 35px 25px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">Rishta Matrimony</h1>
              <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9; color: #e2e8f0;">Islamic Matchmaking & Matrimonial Community</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 35px 30px;">
              <h2 style="margin-top: 0; color: #1f4037; font-size: 20px;">Assalamu Alaikum {user_name},</h2>
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
                You are receiving this email because you registered on Rishta Matrimony.
              </p>
              
              <div style="margin-top: 16px; padding-top: 14px; border-top: 1px dashed #cbd5e0;">
                <p style="margin: 0 0 12px; font-size: 13px; color: #4a5568;">
                  No longer wish to receive these daily updates? You can opt out anytime:
                </p>
                <a href="{unsub_mailto}" style="background: linear-gradient(135deg, #e53e3e, #c53030); color: #ffffff; text-decoration: none; padding: 11px 26px; font-size: 13px; font-weight: 700; border-radius: 6px; display: inline-block; box-shadow: 0 3px 8px rgba(229, 62, 62, 0.35); letter-spacing: 0.4px;">
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
</html>"""

def send_newsletter(is_live=False):
    subscribers = fetch_subscribers()
    print(f"Found {len(subscribers)} active subscribers in Supabase (excluding unsubscribed).")

    if not subscribers:
        print("No subscribers found to send emails to.")
        return

    context = ssl.create_default_context()
    
    if not is_live:
        print(f"TEST RUN MODE: Sending test newsletter only to Admin ({ADMIN_EMAIL})")
        targets = [{"name": "Admin", "email": ADMIN_EMAIL}]
    else:
        print(f"LIVE MODE: Dispatching newsletter to all {len(subscribers)} subscribers...")
        targets = subscribers

    success_count = 0
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        for recipient in targets:
            try:
                msg = MIMEMultipart("alternative")
                msg["Subject"] = "🌟 Rishta Matrimony – Daily Matches & Community Updates"
                msg["From"] = f"Rishta Matrimony <{SENDER_EMAIL}>"
                msg["To"] = recipient["email"]
                msg["List-Unsubscribe"] = f"<mailto:{SENDER_EMAIL}?subject=Unsubscribe>"
                
                html = build_newsletter_html(recipient["name"], recipient["email"])
                msg.attach(MIMEText(html, "html"))
                
                server.sendmail(SENDER_EMAIL, recipient["email"], msg.as_string())
                success_count += 1
                print(f"Sent successfully to: {recipient['email']}")
                
                # Human-like delay between emails to protect sender reputation and avoid spam flags
                time.sleep(2.5)
            except Exception as e:
                print(f"Failed to send to {recipient['email']}: {e}")

    print(f"Newsletter run completed! {success_count}/{len(targets)} emails sent.")

if __name__ == "__main__":
    is_live = "--live" in sys.argv
    send_newsletter(is_live=is_live)
