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

// Allowed verified-field updates → maps request field_name → profiles_data column.
const fieldMap: Record<string, string> = {
  full_name: "name",
  name: "name",
  gender: "gender",
  date_of_birth: "date_of_birth",
  marital_status: "marital_status",
  whatsapp_number: "whatsapp_number",
  location: "location",
  education: "education",
  occupation: "profession",
  profession: "profession",
  caste: "caste",
  maslak: "maslak",
  family: "family",
  family_details: "family",
};

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

    const body = await req.json();
    const action = body.action;

    if (action === "list") {
      const { data: requests } = await admin
        .from("profile_update_requests")
        .select("*")
        .order("created_at", { ascending: false });
      const ids = [...new Set((requests ?? []).map((r) => r.profile_id))];
      const targetIds = [...new Set((requests ?? []).map((r) => r.target_profile_id).filter(Boolean))];
      const allIds = [...new Set([...ids, ...targetIds])];
      const { data: profiles } = allIds.length
        ? await admin.from("profiles_data").select("id, name, email, whatsapp_number, gender, order").in("id", allIds)
        : { data: [] as any[] };
      const enriched = (requests ?? []).map((r) => ({
        ...r,
        profile: profiles?.find((p) => p.id === r.profile_id) ?? null,
        target_profile: r.target_profile_id ? profiles?.find((p) => p.id === r.target_profile_id) ?? null : null,
      }));
      return json({ requests: enriched });
    }

    if (action === "approve") {
      const { request_id, admin_notes } = body;
      const { data: reqRow } = await admin
        .from("profile_update_requests")
        .select("*")
        .eq("id", request_id)
        .maybeSingle();
      if (!reqRow) return json({ error: "Request not found" }, 404);

      const isSingleUnlock =
        reqRow.request_type === "single_unlock" ||
        (reqRow.field_name && reqRow.field_name.includes("SINGLE_PROFILE_UNLOCK"));
      const isPremiumUpgrade =
        reqRow.request_type === "premium_upgrade" ||
        (reqRow.field_name && reqRow.field_name.includes("PREMIUM_UPGRADE"));

      if (isSingleUnlock) {
        let targetId = reqRow.target_profile_id;
        if (!targetId && reqRow.requested_value) {
          const match = reqRow.requested_value.match(/#RM-(?:BR|GR)-(\d+)/i);
          if (match) {
            const num = parseInt(match[1]);
            const { data: tProf } = await admin
              .from("profiles_data")
              .select("id")
              .or(`order.eq.${num},id.eq.${num}`)
              .limit(1)
              .maybeSingle();
            if (tProf) targetId = tProf.id;
          }
        }
        if (!targetId) return json({ error: "Target profile id missing for single profile unlock" }, 400);

        const { error: unlockErr } = await admin
          .from("profile_unlocks")
          .upsert(
            {
              member_profile_id: reqRow.profile_id,
              target_profile_id: targetId,
              request_id: reqRow.id,
              amount: reqRow.amount || 48,
              approved_by: user.id,
            },
            { onConflict: "member_profile_id,target_profile_id" },
          );
        if (unlockErr) return json({ error: unlockErr.message }, 400);
      } else if (isPremiumUpgrade) {
        const expiry = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();
        const { error: upErr } = await admin
          .from("profiles_data")
          .update({
            plan_type: "premium",
            membership_tier: "premium",
            premium_expiry: expiry,
          })
          .eq("id", reqRow.profile_id);
        if (upErr) return json({ error: upErr.message }, 400);
      } else {
        const col = fieldMap[reqRow.field_name];
        if (!col) return json({ error: `Field ${reqRow.field_name} not editable` }, 400);
        const { error: upErr } = await admin
          .from("profiles_data")
          .update({ [col]: reqRow.requested_value })
          .eq("id", reqRow.profile_id);
        if (upErr) return json({ error: upErr.message }, 400);
      }

      await admin
        .from("profile_update_requests")
        .update({
          status: "approved",
          admin_notes: admin_notes ?? null,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", request_id);
      return json({ success: true });
    }

    if (action === "reject") {
      const { request_id, admin_notes } = body;
      await admin
        .from("profile_update_requests")
        .update({
          status: "rejected",
          admin_notes: admin_notes ?? null,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", request_id);
      return json({ success: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e: any) {
    console.error("admin-update-requests error", e);
    return json({ error: e.message || "Server error" }, 500);
  }
});
