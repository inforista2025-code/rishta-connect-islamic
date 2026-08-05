import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const ONLINE_WINDOW_MS = 5 * 60 * 1000;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") || "";
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user) return json({ error: "Not authenticated" }, 401);

    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) return json({ error: "Admin only" }, 403);

    const { data: profiles, error: pErr } = await admin
      .from("profiles_data")
      .select("id, name, email, whatsapp_number, gender, plan_type, verification_status, last_login_at, active_session_id, active_device_info, login_count")
      .order("last_login_at", { ascending: false, nullsFirst: false });
    if (pErr) throw pErr;

    const sessionIds = (profiles ?? [])
      .map((p) => p.active_session_id)
      .filter(Boolean) as string[];

    const { data: sessions } = sessionIds.length
      ? await admin
          .from("member_sessions")
          .select("id, last_active_at, expires_at, revoked_at, device_info")
          .in("id", sessionIds)
      : { data: [] as any[] };

    const now = Date.now();
    const members = (profiles ?? []).map((p) => {
      const s = sessions?.find((x: any) => x.id === p.active_session_id) ?? null;
      const active = !!s && !s.revoked_at && new Date(s.expires_at).getTime() > now;
      const lastActive = s?.last_active_at ?? p.last_login_at ?? null;
      const online =
        active && !!lastActive && now - new Date(lastActive).getTime() < ONLINE_WINDOW_MS;
      return {
        id: p.id,
        name: p.name,
        email: p.email,
        whatsapp_number: p.whatsapp_number,
        gender: p.gender,
        plan_type: p.plan_type,
        verification_status: p.verification_status,
        login_count: p.login_count ?? 0,
        last_login_at: p.last_login_at,
        last_active_at: lastActive,
        session_active: active,
        online,
        device_info: s?.device_info ?? p.active_device_info ?? null,
      };
    });

    return json({
      members,
      online_count: members.filter((m) => m.online).length,
      total_logins: members.reduce((a, m) => a + (m.login_count || 0), 0),
      generated_at: new Date().toISOString(),
    });
  } catch (e: any) {
    console.error("admin-member-activity error", e);
    return json({ error: e.message || "Server error" }, 500);
  }
});