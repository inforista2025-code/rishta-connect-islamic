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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { session_token, action } = await req.json();
    if (!session_token) return json({ valid: false, error: "No session" }, 401);

    const { data: session } = await supabase.from("member_sessions").select("*").eq("id", session_token).maybeSingle();
    if (!session) return json({ valid: false, error: "Invalid session. Please log in again." }, 401);
    if (session.revoked_at) return json({ valid: false, error: "Session ended (logged in on another device). Please log in again." }, 401);
    if (new Date(session.expires_at) < new Date()) return json({ valid: false, error: "Session expired. Please log in again." }, 401);

    // Idle timeout — 90 days since last_active. Members log in infrequently;
    // the previous 14-day window was silently kicking returning users.
    const idleMs = Date.now() - new Date(session.last_active_at).getTime();
    if (idleMs > 90 * 24 * 60 * 60 * 1000) {
      await supabase.from("member_sessions").update({ revoked_at: new Date().toISOString() }).eq("id", session.id);
      return json({ valid: false, error: "Session expired. Please log in again." }, 401);
    }

    if (action === "logout") {
      await supabase.from("member_sessions").update({ revoked_at: new Date().toISOString() }).eq("id", session.id);
      return json({ success: true });
    }

    await supabase.from("member_sessions").update({ last_active_at: new Date().toISOString() }).eq("id", session.id);

    let reg: any = null;
    if (session.registration_id) {
      const { data } = await supabase.from("registrations")
        .select("id, full_name, email, whatsapp_number, plan_type, premium_expiry, verification_status, residence_location, gender, date_of_birth")
        .eq("id", session.registration_id).maybeSingle();
      reg = data;
    } else if (session.profile_data_id) {
      const { data } = await supabase.from("profiles_data")
        .select("id, name, email, whatsapp_number, plan_type, premium_expiry, verification_status, location, gender, date_of_birth")
        .eq("id", session.profile_data_id).maybeSingle();
      if (data) {
        reg = {
          id: String(data.id),
          full_name: data.name,
          email: data.email,
          whatsapp_number: data.whatsapp_number,
          plan_type: data.plan_type,
          premium_expiry: data.premium_expiry,
          verification_status: data.verification_status,
          residence_location: data.location,
          gender: data.gender,
          date_of_birth: data.date_of_birth,
        };
      }
    }

    if (!reg || String(reg.verification_status).toLowerCase() !== "verified") {
      await supabase.from("member_sessions").update({ revoked_at: new Date().toISOString() }).eq("id", session.id);
      return json({ valid: false, error: "Account no longer active" }, 401);
    }

    return json({ valid: true, member: reg });
  } catch (e: any) {
    console.error("member-session-validate error", e);
    return json({ valid: false, error: e.message || "Server error" }, 500);
  }
});