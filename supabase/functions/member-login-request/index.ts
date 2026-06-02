import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") ?? "Rista Matrimony <onboarding@resend.dev>";
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

function normalizeWA(input: string): string {
  return (input || "").replace(/[^\d]/g, "");
}

async function hashCode(code: string): Promise<string> {
  const data = new TextEncoder().encode(code);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { whatsapp_number } = await req.json();
    if (!whatsapp_number || typeof whatsapp_number !== "string") {
      return new Response(JSON.stringify({ error: "WhatsApp number is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const digits = normalizeWA(whatsapp_number);
    if (digits.length < 7) {
      return new Response(JSON.stringify({ error: "Invalid WhatsApp number" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Find any registration with matching trailing digits (handle +country variations)
    const { data: rows, error } = await supabase
      .from("registrations")
      .select("id, full_name, email, whatsapp_number, verification_status, plan_type");
    if (error) throw error;

    const match = (rows || []).find(r => normalizeWA(r.whatsapp_number).endsWith(digits) || digits.endsWith(normalizeWA(r.whatsapp_number)));

    if (!match) {
      return new Response(JSON.stringify({ error: "Account not found or not verified." }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (match.verification_status !== "verified") {
      return new Response(JSON.stringify({ error: "Your profile is not verified yet. Please wait for admin approval." }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const code_hash = await hashCode(code);
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // invalidate prior unconsumed OTPs
    await supabase.from("member_otps").update({ consumed_at: new Date().toISOString() }).is("consumed_at", null).eq("registration_id", match.id);

    const { error: insErr } = await supabase.from("member_otps").insert({
      registration_id: match.id,
      email: match.email,
      code_hash,
      expires_at,
    });
    if (insErr) throw insErr;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [match.email],
      subject: "Your Rista Matrimony login code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #e91e63;">Assalamu Alaikum ${match.full_name},</h2>
          <p style="font-size:16px;color:#333;">Use the verification code below to sign in to your member account.</p>
          <div style="font-size:32px;font-weight:bold;letter-spacing:8px;background:#fdf2f8;color:#e91e63;padding:16px;text-align:center;border-radius:8px;margin:16px 0;">${code}</div>
          <p style="font-size:14px;color:#666;">This code will expire in 10 minutes. If you did not request it, please ignore this email.</p>
          <p style="font-size:14px;color:#666;">— Rista Matrimony Team</p>
        </div>
      `,
    });

    // Return masked email
    const masked = match.email.replace(/(.{2}).+(@.+)/, "$1***$2");
    return new Response(JSON.stringify({ success: true, email_hint: masked }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("member-login-request error", e);
    return new Response(JSON.stringify({ error: e.message || "Server error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});