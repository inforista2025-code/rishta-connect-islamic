import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function authSession(token: string) {
  if (!token) return { error: "No session" as const };
  const { data: session } = await supabase
    .from("member_sessions")
    .select("*")
    .eq("id", token)
    .maybeSingle();
  if (!session || session.revoked_at) return { error: "Invalid session" as const };
  if (new Date(session.expires_at) < new Date()) return { error: "Expired" as const };
  if (!session.profile_data_id) return { error: "No profile linked" as const };
  const { data: profile } = await supabase
    .from("profiles_data")
    .select("*")
    .eq("id", session.profile_data_id)
    .maybeSingle();
  if (!profile) return { error: "Profile not found" as const };
  return { session, profile };
}

function isPremium(p: any) {
  if (p?.plan_type !== "premium") return false;
  if (!p.premium_expiry) return true;
  return new Date(p.premium_expiry) > new Date();
}

function computeCompletion(p: any, editable: any) {
  const weights: Record<string, number> = {
    photo: 15,
    full_name: 5,
    email: 5,
    whatsapp: 5,
    location: 10,
    education: 10,
    occupation: 10,
    family: 10,
    islamic_knowledge: 5,
    partner_preferences: 10,
    about_me: 15,
  };
  const labels: Record<string, string> = {
    photo: "Profile Photo",
    full_name: "Full Name",
    email: "Email",
    whatsapp: "WhatsApp Number",
    location: "Location",
    education: "Education",
    occupation: "Occupation",
    family: "Family Details",
    islamic_knowledge: "Islamic Knowledge",
    partner_preferences: "Partner Preferences",
    about_me: "About Me / Bio",
  };
  const has: Record<string, boolean> = {
    photo: Array.isArray(p.photo_urls) && p.photo_urls.length > 0,
    full_name: !!p.name,
    email: !!p.email,
    whatsapp: !!p.whatsapp_number,
    location: !!p.location,
    education: !!p.education,
    occupation: !!p.profession,
    family: !!p.family,
    islamic_knowledge: !!p.islamic_knowledge,
    partner_preferences: !!(editable?.partner_preferences || p.preferred_partner),
    about_me: !!editable?.about_me,
  };
  let total = 0;
  const missing: { key: string; label: string; weight: number }[] = [];
  for (const k of Object.keys(weights)) {
    if (has[k]) total += weights[k];
    else missing.push({ key: k, label: labels[k], weight: weights[k] });
  }
  return { percent: total, missing };
}

function sanitizeProfile(p: any, viewerIsPremium: boolean, isSelf: boolean) {
  const base = {
    id: p.id,
    name: p.name,
    gender: p.gender,
    age: p.age,
    location: p.location,
    height: p.height,
    complexion: p.complexion,
    education: p.education,
    profession: p.profession,
    marital_status: p.marital_status,
    caste: p.caste,
    maslak: p.maslak,
    islamic_knowledge: p.islamic_knowledge,
    family: p.family,
    preferred_partner: p.preferred_partner,
    preferred_location: p.preferred_location,
    preferred_age: p.preferred_age,
    plan_type: p.plan_type,
    is_premium: isPremium(p),
    photo_urls: Array.isArray(p.photo_urls) && p.photo_urls.length ? [p.photo_urls[0]] : [],
  };
  if (viewerIsPremium || isSelf) {
    return {
      ...base,
      email: p.email,
      whatsapp_number: p.whatsapp_number,
      biodata_url: p.biodata_url,
      photo_urls: p.photo_urls || [],
      other_info: p.other_info,
    };
  }
  return base;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json();
    const { session_token, action } = body;
    const auth = await authSession(session_token);
    if ("error" in auth) return json({ error: auth.error }, 401);
    const { profile } = auth;
    const profileId = profile.id;
    const premium = isPremium(profile);

    // Load editable extension
    const { data: editableExisting } = await supabase
      .from("member_editable_profile")
      .select("*")
      .eq("profile_id", profileId)
      .maybeSingle();

    switch (action) {
      case "get_profile": {
        const completion = computeCompletion(profile, editableExisting);
        return json({
          profile,
          editable: editableExisting ?? {},
          is_premium: premium,
          completion,
        });
      }

      case "update_editable": {
        const allowed = [
          "about_me",
          "partner_preferences",
          "preferred_age_range",
          "preferred_location",
          "hobbies",
          "additional_info",
          "personal_introduction",
        ];
        const payload: Record<string, string | null> = { profile_id: profileId };
        for (const k of allowed) if (k in (body.values || {})) payload[k] = body.values[k] ?? null;
        const { error } = await supabase
          .from("member_editable_profile")
          .upsert(payload, { onConflict: "profile_id" });
        if (error) return json({ error: error.message }, 400);
        return json({ success: true });
      }

      case "request_update": {
        const { field_name, current_value, requested_value, reason } = body;
        if (!field_name || !requested_value)
          return json({ error: "field_name and requested_value required" }, 400);
        const { error } = await supabase.from("profile_update_requests").insert({
          profile_id: profileId,
          field_name,
          current_value: current_value ?? null,
          requested_value,
          reason: reason ?? null,
        });
        if (error) return json({ error: error.message }, 400);
        return json({ success: true });
      }

      case "list_my_update_requests": {
        const { data } = await supabase
          .from("profile_update_requests")
          .select("*")
          .eq("profile_id", profileId)
          .order("created_at", { ascending: false });
        return json({ requests: data ?? [] });
      }

      case "list_saved": {
        const { data } = await supabase
          .from("saved_profiles")
          .select("saved_profile_id, created_at")
          .eq("owner_profile_id", profileId)
          .order("created_at", { ascending: false });
        const ids = (data ?? []).map((r) => r.saved_profile_id);
        if (!ids.length) return json({ saved: [] });
        const { data: profiles } = await supabase
          .from("profiles_data")
          .select("*")
          .in("id", ids)
          .eq("verification_status", "Verified");
        const sorted = ids
          .map((id) => profiles?.find((p) => p.id === id))
          .filter(Boolean)
          .map((p) => sanitizeProfile(p, premium, false));
        return json({ saved: sorted });
      }

      case "save_profile": {
        const target = Number(body.target_id);
        if (!target || target === profileId) return json({ error: "Invalid target" }, 400);
        await supabase
          .from("saved_profiles")
          .upsert(
            { owner_profile_id: profileId, saved_profile_id: target },
            { onConflict: "owner_profile_id,saved_profile_id" },
          );
        return json({ success: true });
      }

      case "unsave_profile": {
        const target = Number(body.target_id);
        await supabase
          .from("saved_profiles")
          .delete()
          .eq("owner_profile_id", profileId)
          .eq("saved_profile_id", target);
        return json({ success: true });
      }

      case "send_interest": {
        const target = Number(body.target_id);
        if (!target || target === profileId) return json({ error: "Invalid target" }, 400);
        if (!premium) {
          const monthAgo = new Date();
          monthAgo.setDate(monthAgo.getDate() - 30);
          const { count } = await supabase
            .from("profile_interests")
            .select("id", { count: "exact", head: true })
            .eq("sender_profile_id", profileId)
            .gte("created_at", monthAgo.toISOString());
          if ((count ?? 0) >= 5)
            return json(
              { error: "limit_reached", message: "Free plan limit of 5 interests/month reached. Upgrade to Premium for unlimited." },
              402,
            );
        }
        const { error } = await supabase
          .from("profile_interests")
          .upsert(
            { sender_profile_id: profileId, receiver_profile_id: target, status: "sent" },
            { onConflict: "sender_profile_id,receiver_profile_id" },
          );
        if (error) return json({ error: error.message }, 400);
        return json({ success: true });
      }

      case "list_interests": {
        const direction = body.direction === "received" ? "received" : "sent";
        const col = direction === "sent" ? "sender_profile_id" : "receiver_profile_id";
        const otherCol = direction === "sent" ? "receiver_profile_id" : "sender_profile_id";
        const { data: interests } = await supabase
          .from("profile_interests")
          .select("*")
          .eq(col, profileId)
          .order("created_at", { ascending: false });
        const ids = (interests ?? []).map((r: any) => r[otherCol]);
        if (!ids.length) return json({ interests: [] });
        const { data: profiles } = await supabase
          .from("profiles_data")
          .select("*")
          .in("id", ids);
        const enriched = (interests ?? []).map((r: any) => {
          const p = profiles?.find((x) => x.id === r[otherCol]);
          return { ...r, profile: p ? sanitizeProfile(p, premium, false) : null };
        });
        return json({ interests: enriched });
      }

      case "recommendations": {
        const wantGender = profile.gender === "Male" ? "Female" : profile.gender === "Female" ? "Male" : null;
        let q = supabase
          .from("profiles_data")
          .select("*")
          .eq("verification_status", "Verified")
          .eq("is_live", true)
          .neq("id", profileId)
          .limit(24);
        if (wantGender) q = q.eq("gender", wantGender);
        if (profile.preferred_location)
          q = q.ilike("location", `%${String(profile.preferred_location).split(",")[0].trim()}%`);
        const { data } = await q;
        const sorted = (data ?? [])
          .sort((a: any, b: any) => Number(isPremium(b)) - Number(isPremium(a)))
          .map((p) => sanitizeProfile(p, premium, false));
        return json({ recommendations: sorted });
      }

      default:
        return json({ error: "Unknown action" }, 400);
    }
  } catch (e: any) {
    console.error("member-dashboard error", e);
    return json({ error: e.message || "Server error" }, 500);
  }
});
