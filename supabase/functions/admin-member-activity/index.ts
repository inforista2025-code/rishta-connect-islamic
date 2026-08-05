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

    // Recent OTP / login attempts (last 30 days) so admins can see failures too.
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: otps } = await admin
      .from("member_otps")
      .select("id, profile_data_id, registration_id, email, created_at, consumed_at, attempts, expires_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(500);

    const otpStatus = (o: any) => {
      if (o.consumed_at) return { status: "success", label: "Login successful" };
      if ((o.attempts ?? 0) >= 5) return { status: "blocked", label: "Too many wrong codes — blocked" };
      if ((o.attempts ?? 0) > 0 && new Date(o.expires_at).getTime() < Date.now())
        return { status: "failed", label: `Wrong code entered (${o.attempts} tries), then expired` };
      if ((o.attempts ?? 0) > 0) return { status: "failed", label: `Wrong code entered (${o.attempts} tries)` };
      if (new Date(o.expires_at).getTime() < Date.now())
        return { status: "expired", label: "Code sent but never entered (expired)" };
      return { status: "pending", label: "Code sent — waiting for member to enter it" };
    };

    const now = Date.now();
    const members = (profiles ?? []).map((p) => {
      const s = sessions?.find((x: any) => x.id === p.active_session_id) ?? null;
      const active = !!s && !s.revoked_at && new Date(s.expires_at).getTime() > now;
      const lastActive = s?.last_active_at ?? p.last_login_at ?? null;
      const online =
        active && !!lastActive && now - new Date(lastActive).getTime() < ONLINE_WINDOW_MS;
      const myOtps = (otps ?? []).filter((o: any) => o.profile_data_id === p.id);
      const lastOtp = myOtps[0] ?? null;
      const st = lastOtp ? otpStatus(lastOtp) : null;
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
        otp_requests_30d: myOtps.length,
        failed_logins_30d: myOtps.filter((o: any) => !o.consumed_at).length,
        last_otp_at: lastOtp?.created_at ?? null,
        last_otp_email: lastOtp?.email ?? null,
        last_login_issue: st && st.status !== "success" ? st.label : null,
        last_otp_status: st?.status ?? null,
      };
    });

    const profileById = new Map((profiles ?? []).map((p: any) => [p.id, p]));
    const attempts = (otps ?? []).slice(0, 100).map((o: any) => {
      const st = otpStatus(o);
      const p: any = o.profile_data_id ? profileById.get(o.profile_data_id) : null;
      return {
        id: o.id,
        name: p?.name ?? "Unknown member",
        email: o.email,
        whatsapp_number: p?.whatsapp_number ?? null,
        created_at: o.created_at,
        attempts: o.attempts ?? 0,
        status: st.status,
        label: st.label,
      };
    });

    return json({
      members,
      attempts,
      failed_attempts_count: attempts.filter((a) => a.status !== "success").length,
      online_count: members.filter((m) => m.online).length,
      total_logins: members.reduce((a, m) => a + (m.login_count || 0), 0),
      generated_at: new Date().toISOString(),
    });
  } catch (e: any) {
    console.error("admin-member-activity error", e);
    return json({ error: e.message || "Server error" }, 500);
  }
});