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

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizeWA(input: string): string {
  return (input || "").replace(/[^\d]/g, "");
}
function matchKey(input: string): string {
  const d = normalizeWA(input);
  return d.length > 10 ? d.slice(-10) : d;
}

async function hashCode(code: string): Promise<string> {
  const data = new TextEncoder().encode(code);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function toProfileMember(row: any) {
  return {
    source: "profiles_data",
    registration_id: null,
    profile_data_id: row.id,
    full_name: row.name,
    email: row.email,
    whatsapp_number: row.whatsapp_number,
    verification_status: row.verification_status,
    plan_type: row.plan_type,
    premium_expiry: row.premium_expiry ?? null,
    residence_location: row.location ?? null,
    gender: row.gender ?? null,
    date_of_birth: row.date_of_birth ?? null,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { whatsapp_number, code, device_info } = await req.json();
    if (!whatsapp_number || !code) {
      return json({ error: "Missing fields" });
    }
    const key = matchKey(whatsapp_number);

    const { data: registrationRows, error: regError } = await supabase
      .from("registrations")
      .select("id, full_name, email, whatsapp_number, verification_status, plan_type, premium_expiry");
    if (regError) throw regError;

    const { data: profileRows, error: profileError } = await supabase
      .from("profiles_data")
      .select("id, registration_id, name, email, whatsapp_number, verification_status, plan_type, premium_expiry, location, gender, date_of_birth")
      .not("email", "is", null)
      .limit(5000);
    if (profileError) throw profileError;

    const registrationMatch = (registrationRows || []).find((r: any) => {
      const rk = matchKey(r.whatsapp_number || "");
      return rk && (rk === key || rk.endsWith(key) || key.endsWith(rk));
    });
    const profileMatch = (profileRows || []).find((r: any) => {
      const rk = matchKey(r.whatsapp_number || "");
      return rk && (rk === key || rk.endsWith(key) || key.endsWith(rk));
    });
    // IMPORTANT: must mirror member-login-request priority (profiles_data first),
    // otherwise the OTP stored against profile_data_id can't be found here and
    // users get "No active code. Please request a new one."
    const reg = profileMatch
      ? toProfileMember(profileMatch)
      : (registrationMatch
          ? { source: "registrations", registration_id: registrationMatch.id, profile_data_id: null, ...registrationMatch }
          : null);
    console.log("verify match", {
      key,
      chosen_source: reg?.source,
      profile_data_id: reg?.profile_data_id,
      registration_id: reg?.registration_id,
    });

    if (!reg || String(reg.verification_status).toLowerCase() !== "verified") {
      return json({ error: "Account not found or not verified." });
    }

    let otpQuery = supabase
      .from("member_otps")
      .select("*")
      .is("consumed_at", null)
      .order("created_at", { ascending: false })
      .limit(1);
    otpQuery = reg.registration_id ? otpQuery.eq("registration_id", reg.registration_id) : otpQuery.eq("profile_data_id", reg.profile_data_id);
    const { data: otp, error: otpError } = await otpQuery.maybeSingle();
    if (otpError) throw otpError;

    if (!otp) return json({ error: "No active code. Please request a new one." });
    if (new Date(otp.expires_at) < new Date()) return json({ error: "Code expired. Please request a new one." });
    if (otp.attempts >= 5) return json({ error: "Too many attempts. Please request a new code." });

    const code_hash = await hashCode(String(code).trim());
    if (code_hash !== otp.code_hash) {
      await supabase.from("member_otps").update({ attempts: otp.attempts + 1 }).eq("id", otp.id);
      return json({ error: "Invalid verification code." });
    }

    await supabase.from("member_otps").update({ consumed_at: new Date().toISOString() }).eq("id", otp.id);

    // Insert the new session FIRST so that a concurrent request/race never
    // revokes the freshly-issued token before it can be returned to the client.
    const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: session, error: sErr } = await supabase.from("member_sessions").insert({
      registration_id: reg.registration_id,
      profile_data_id: reg.profile_data_id,
      device_info: device_info ?? null,
      expires_at,
    }).select("id").single();
    if (sErr) throw sErr;

    // Single-device: revoke every OTHER active session for this member.
    const revokeQuery = supabase
      .from("member_sessions")
      .update({ revoked_at: new Date().toISOString() })
      .is("revoked_at", null)
      .neq("id", session.id);
    if (reg.registration_id) await revokeQuery.eq("registration_id", reg.registration_id);
    else await revokeQuery.eq("profile_data_id", reg.profile_data_id);

    if (reg.registration_id) {
      await supabase.from("registrations").update({
        last_login_at: new Date().toISOString(),
        active_session_id: session.id,
        active_device_info: device_info ?? null,
      }).eq("id", reg.registration_id);
    } else {
      await supabase.from("profiles_data").update({
        last_login_at: new Date().toISOString(),
        active_session_id: session.id,
        active_device_info: device_info ?? null,
      }).eq("id", reg.profile_data_id);
    }

    return json({
      success: true,
      session_token: session.id,
      member: {
        id: reg.registration_id ?? String(reg.profile_data_id),
        full_name: reg.full_name,
        email: reg.email,
        plan_type: reg.plan_type,
        premium_expiry: reg.premium_expiry,
      },
    });
  } catch (e: any) {
    console.error("member-login-verify error", e);
    return json({ error: e.message || "Server error" }, 500);
  }
});