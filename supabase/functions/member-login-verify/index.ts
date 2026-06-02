import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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
    const { whatsapp_number, code, device_info } = await req.json();
    if (!whatsapp_number || !code) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const digits = normalizeWA(whatsapp_number);

    const { data: rows } = await supabase
      .from("registrations")
      .select("id, full_name, email, whatsapp_number, verification_status, plan_type, premium_expiry");
    const reg = (rows || []).find(r => normalizeWA(r.whatsapp_number).endsWith(digits) || digits.endsWith(normalizeWA(r.whatsapp_number)));
    if (!reg || reg.verification_status !== "verified") {
      return new Response(JSON.stringify({ error: "Account not found or not verified." }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: otp } = await supabase
      .from("member_otps")
      .select("*")
      .eq("registration_id", reg.id)
      .is("consumed_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!otp) return new Response(JSON.stringify({ error: "No active code. Please request a new one." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (new Date(otp.expires_at) < new Date()) return new Response(JSON.stringify({ error: "Code expired. Please request a new one." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (otp.attempts >= 5) return new Response(JSON.stringify({ error: "Too many attempts. Please request a new code." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const code_hash = await hashCode(String(code).trim());
    if (code_hash !== otp.code_hash) {
      await supabase.from("member_otps").update({ attempts: otp.attempts + 1 }).eq("id", otp.id);
      return new Response(JSON.stringify({ error: "Invalid verification code." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    await supabase.from("member_otps").update({ consumed_at: new Date().toISOString() }).eq("id", otp.id);

    // Single-device: revoke all existing sessions for this registration
    await supabase.from("member_sessions").update({ revoked_at: new Date().toISOString() })
      .eq("registration_id", reg.id).is("revoked_at", null);

    const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: session, error: sErr } = await supabase.from("member_sessions").insert({
      registration_id: reg.id,
      device_info: device_info ?? null,
      expires_at,
    }).select("id").single();
    if (sErr) throw sErr;

    await supabase.from("registrations").update({
      last_login_at: new Date().toISOString(),
      active_session_id: session.id,
      active_device_info: device_info ?? null,
    }).eq("id", reg.id);

    return new Response(JSON.stringify({
      success: true,
      session_token: session.id,
      member: {
        id: reg.id,
        full_name: reg.full_name,
        email: reg.email,
        plan_type: reg.plan_type,
        premium_expiry: reg.premium_expiry,
      },
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("member-login-verify error", e);
    return new Response(JSON.stringify({ error: e.message || "Server error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});