import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";
import nodemailer from "npm:nodemailer@6.9.14";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const GMAIL_SMTP_HOST = Deno.env.get("GMAIL_SMTP_HOST") ?? "smtp.gmail.com";
const GMAIL_SMTP_PORT = parseInt(Deno.env.get("GMAIL_SMTP_PORT") ?? "465", 10);
const GMAIL_ADDRESS = Deno.env.get("GMAIL_ADDRESS");
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");
const FROM_NAME = "Rista Matrimony";
const supabase = (SUPABASE_URL && SERVICE_ROLE) ? createClient(SUPABASE_URL, SERVICE_ROLE) : null as any;

// International phone normalization. Returns last 10 digits for matching
// (covers most countries' subscriber numbers reliably).
function normalizeWA(input: string): string {
  return (input || "").replace(/[^\d]/g, "");
}
function matchKey(input: string): string {
  const d = normalizeWA(input);
  return d.length > 10 ? d.slice(-10) : d;
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function toProfileMember(row: any) {
  return {
    source: "profiles_data",
    profile_data_id: row.id,
    registration_id: null,
    full_name: row.name,
    email: row.email,
    whatsapp_number: row.whatsapp_number,
    verification_status: row.verification_status,
    plan_type: row.plan_type,
    premium_expiry: row.premium_expiry ?? null,
  };
}

async function hashCode(code: string): Promise<string> {
  const data = new TextEncoder().encode(code);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function sendOtpEmail(to: string, fullName: string, code: string) {
  if (!GMAIL_ADDRESS || !GMAIL_APP_PASSWORD) {
    throw new Error("SMTP configuration missing. Please set GMAIL_ADDRESS and GMAIL_APP_PASSWORD.");
  }
  const transporter = nodemailer.createTransport({
    host: GMAIL_SMTP_HOST,
    port: GMAIL_SMTP_PORT,
    secure: GMAIL_SMTP_PORT === 465,
    auth: { user: GMAIL_ADDRESS, pass: GMAIL_APP_PASSWORD },
  });
  await transporter.sendMail({
    from: `${FROM_NAME} <${GMAIL_ADDRESS}>`,
    to,
    subject: "Your Rista Matrimony login code",
    text: `Assalamu Alaikum ${fullName},\n\nYour verification code is: ${code}\n\nThis code expires in 10 minutes.\n\n— Rista Matrimony Team`,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #e91e63;">Assalamu Alaikum ${fullName},</h2>
          <p style="font-size:16px;color:#333;">Use the verification code below to sign in to your member account.</p>
          <div style="font-size:32px;font-weight:bold;letter-spacing:8px;background:#fdf2f8;color:#e91e63;padding:16px;text-align:center;border-radius:8px;margin:16px 0;">${code}</div>
          <p style="font-size:14px;color:#666;">This code will expire in 10 minutes. If you did not request it, please ignore this email.</p>
          <p style="font-size:14px;color:#666;">— Rista Matrimony Team</p>
        </div>
      `,
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      console.error("Missing SUPABASE_URL or SERVICE_ROLE_KEY");
      return json({ error: "Server configuration error (database)." }, 500);
    }
    if (!GMAIL_ADDRESS || !GMAIL_APP_PASSWORD) {
      console.error("Missing GMAIL_ADDRESS or GMAIL_APP_PASSWORD");
      return json({ error: "SMTP configuration missing. Please configure Gmail SMTP credentials." }, 500);
    }
    const { whatsapp_number } = await req.json();
    if (!whatsapp_number || typeof whatsapp_number !== "string") {
      return json({ error: "WhatsApp number is required" }, 400);
    }
    const digits = normalizeWA(whatsapp_number);
    const key = matchKey(whatsapp_number);
    if (digits.length < 7) {
      return json({ error: "Invalid WhatsApp number" }, 400);
    }
    console.log("login-request digits=", digits, "key=", key);

    // Match by last 10 digits to ignore country-code formatting differences.
    // Admin Dashboard's canonical profile list is profiles_data, while newer
    // form submissions can also exist in registrations. Check both without
    // creating duplicate user/member rows.
    const { data: registrationRows, error: regError } = await supabase
      .from("registrations")
      .select("id, full_name, email, whatsapp_number, verification_status, plan_type, premium_expiry")
      .limit(2000);
    if (regError) { console.error("registrations DB error", regError); throw regError; }

    const { data: profileRows, error: profileError } = await supabase
      .from("profiles_data")
      .select("id, registration_id, name, email, whatsapp_number, verification_status, plan_type, premium_expiry")
      .not("email", "is", null)
      .limit(5000);
    if (profileError) { console.error("profiles_data DB error", profileError); throw profileError; }
    console.log("Scanned registrations:", registrationRows?.length ?? 0, "profiles_data:", profileRows?.length ?? 0);

    const registrationMatch = (registrationRows || []).find((r: any) => {
      const rk = matchKey(r.whatsapp_number || "");
      return rk && (rk === key || rk.endsWith(key) || key.endsWith(rk));
    });
    const profileMatch = (profileRows || []).find((r: any) => {
      const rk = matchKey(r.whatsapp_number || "");
      return rk && (rk === key || rk.endsWith(key) || key.endsWith(rk));
    });
    const match = registrationMatch ? { source: "registrations", registration_id: registrationMatch.id, profile_data_id: null, ...registrationMatch } : (profileMatch ? toProfileMember(profileMatch) : null);

    if (!match) {
      console.log("No matching member profile for key", key);
      return json({ error: "Account not found or not verified." });
    }
    if (String(match.verification_status).toLowerCase() !== "verified") {
      console.log("Match found but status =", match.verification_status);
      return json({ error: "Your profile is not verified yet. Please wait for admin approval." });
    }
    if (!match.email) {
      console.log("Match found but no email", match.source, match.registration_id ?? match.profile_data_id);
      return json({ error: "No email is linked with this profile. Please contact admin." });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const code_hash = await hashCode(code);
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // invalidate prior unconsumed OTPs
    const otpUpdate = supabase.from("member_otps").update({ consumed_at: new Date().toISOString() }).is("consumed_at", null);
    if (match.registration_id) await otpUpdate.eq("registration_id", match.registration_id);
    else await otpUpdate.eq("profile_data_id", match.profile_data_id);

    const { error: insErr } = await supabase.from("member_otps").insert({
      registration_id: match.registration_id,
      profile_data_id: match.profile_data_id,
      email: match.email,
      code_hash,
      expires_at,
    });
    if (insErr) throw insErr;

    try {
      await sendOtpEmail(match.email, match.full_name, code);
    } catch (mailErr: any) {
      console.error("SMTP send error", mailErr);
      await supabase.from("member_otps").update({ consumed_at: new Date().toISOString() }).eq("code_hash", code_hash);
      return json({ error: `Failed to send verification email: ${mailErr.message || "SMTP error"}` }, 502);
    }

    // Return masked email
    const masked = match.email.replace(/(.{2}).+(@.+)/, "$1***$2");
    return json({ success: true, email_hint: masked });
  } catch (e: any) {
    console.error("member-login-request error", e);
    return json({ error: e.message || "Server error" }, 500);
  }
});