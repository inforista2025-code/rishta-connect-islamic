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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { session_token, action } = await req.json();
    if (!session_token) return new Response(JSON.stringify({ valid: false, error: "No session" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: session } = await supabase.from("member_sessions").select("*").eq("id", session_token).maybeSingle();
    if (!session) return new Response(JSON.stringify({ valid: false, error: "Invalid session" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (session.revoked_at) return new Response(JSON.stringify({ valid: false, error: "Logged out from another device" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (new Date(session.expires_at) < new Date()) return new Response(JSON.stringify({ valid: false, error: "Session expired" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Idle timeout — 14 days since last_active
    const idleMs = Date.now() - new Date(session.last_active_at).getTime();
    if (idleMs > 14 * 24 * 60 * 60 * 1000) {
      await supabase.from("member_sessions").update({ revoked_at: new Date().toISOString() }).eq("id", session.id);
      return new Response(JSON.stringify({ valid: false, error: "Session expired due to inactivity" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "logout") {
      await supabase.from("member_sessions").update({ revoked_at: new Date().toISOString() }).eq("id", session.id);
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    await supabase.from("member_sessions").update({ last_active_at: new Date().toISOString() }).eq("id", session.id);

    const { data: reg } = await supabase.from("registrations")
      .select("id, full_name, email, whatsapp_number, plan_type, premium_expiry, verification_status, residence_location, gender, date_of_birth")
      .eq("id", session.registration_id).maybeSingle();

    if (!reg || reg.verification_status !== "verified") {
      await supabase.from("member_sessions").update({ revoked_at: new Date().toISOString() }).eq("id", session.id);
      return new Response(JSON.stringify({ valid: false, error: "Account no longer active" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ valid: true, member: reg }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("member-session-validate error", e);
    return new Response(JSON.stringify({ valid: false, error: e.message || "Server error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});