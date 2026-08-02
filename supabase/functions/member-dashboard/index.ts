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
  const allPhotos = Array.isArray(p.photo_urls) ? p.photo_urls : [];
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
    photo_urls: allPhotos.length ? [allPhotos[0]] : [],
    photo_count: allPhotos.length,
    photo_blurred: !(viewerIsPremium || isSelf),
  };
  if (viewerIsPremium || isSelf) {
    return {
      ...base,
      email: p.email,
      whatsapp_number: p.whatsapp_number,
      biodata_url: p.biodata_url,
      photo_urls: allPhotos,
      photo_blurred: false,
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

      case "dashboard_summary": {
        const completion = computeCompletion(profile, editableExisting);
        // counts
        const [savedCount, viewedCount, viewersCount, sentMonth] = await Promise.all([
          supabase.from("saved_profiles").select("id", { count: "exact", head: true }).eq("owner_profile_id", profileId),
          supabase.from("profile_views").select("id", { count: "exact", head: true }).eq("viewer_profile_id", profileId),
          supabase.from("profile_views").select("id", { count: "exact", head: true }).eq("viewed_profile_id", profileId),
          (async () => {
            const monthAgo = new Date(); monthAgo.setDate(monthAgo.getDate() - 30);
            return supabase.from("profile_interests").select("id", { count: "exact", head: true })
              .eq("sender_profile_id", profileId).gte("created_at", monthAgo.toISOString());
          })(),
        ]);
        const freeLimit = 5;
        const sentThisMonth = sentMonth.count ?? 0;
        const freeLeft = premium ? null : Math.max(0, freeLimit - sentThisMonth);

        const wantGender = profile.gender === "Male" ? "Female" : profile.gender === "Female" ? "Male" : null;
        const recQ = supabase
          .from("profiles_data")
          .select("*")
          .ilike("verification_status", "verified")
          .eq("is_live", true)
          .neq("id", profileId)
          .limit(12);
        if (wantGender) recQ.eq("gender", wantGender);
        const { data: recRaw } = await recQ;
        const recommendations = (recRaw ?? [])
          .sort((a: any, b: any) => Number(isPremium(b)) - Number(isPremium(a)))
          .map((p) => sanitizeProfile(p, premium, false));

        // recently viewed by me
        const { data: rvRows } = await supabase
          .from("profile_views")
          .select("viewed_profile_id, viewed_at")
          .eq("viewer_profile_id", profileId)
          .order("viewed_at", { ascending: false })
          .limit(20);
        const rvIds: number[] = [];
        const rvSeen = new Set<number>();
        const rvTime: Record<number, string> = {};
        for (const r of (rvRows ?? [])) {
          if (!rvSeen.has(r.viewed_profile_id)) {
            rvSeen.add(r.viewed_profile_id);
            rvIds.push(r.viewed_profile_id);
            rvTime[r.viewed_profile_id] = r.viewed_at;
          }
        }
        const { data: rvProfiles } = rvIds.length
          ? await supabase.from("profiles_data").select("*").in("id", rvIds)
          : { data: [] as any[] };
        const recentlyViewed = rvIds
          .map((id) => rvProfiles?.find((p: any) => p.id === id))
          .filter(Boolean)
          .map((p: any) => ({ ...sanitizeProfile(p, premium, false), viewed_at: rvTime[p.id] }));

        // who viewed me
        const { data: wvRows } = await supabase
          .from("profile_views")
          .select("viewer_profile_id, viewed_at")
          .eq("viewed_profile_id", profileId)
          .order("viewed_at", { ascending: false })
          .limit(20);
        const wvIds: number[] = [];
        const wvSeen = new Set<number>();
        const wvTime: Record<number, string> = {};
        for (const r of (wvRows ?? [])) {
          if (!wvSeen.has(r.viewer_profile_id)) {
            wvSeen.add(r.viewer_profile_id);
            wvIds.push(r.viewer_profile_id);
            wvTime[r.viewer_profile_id] = r.viewed_at;
          }
        }
        const limitedWvIds = premium ? wvIds : wvIds.slice(0, 4);
        const { data: wvProfiles } = limitedWvIds.length
          ? await supabase.from("profiles_data").select("*").in("id", limitedWvIds)
          : { data: [] as any[] };
        const whoViewedMe = limitedWvIds
          .map((id) => wvProfiles?.find((p: any) => p.id === id))
          .filter(Boolean)
          .map((p: any) => ({ ...sanitizeProfile(p, premium, false), viewed_at: wvTime[p.id] }));

        // new profiles this week
        const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
        let newQ = supabase.from("profiles_data").select("*")
          .ilike("verification_status", "verified").eq("is_live", true)
          .neq("id", profileId)
          .gte("created_at", weekAgo.toISOString())
          .order("created_at", { ascending: false }).limit(8);
        if (wantGender) newQ = newQ.eq("gender", wantGender);
        const { data: newRaw } = await newQ;
        const newThisWeek = (newRaw ?? []).map((p: any) => sanitizeProfile(p, premium, false));

        return json({
          profile: sanitizeProfile(profile, true, true),
          editable: editableExisting ?? {},
          is_premium: premium,
          completion,
          counts: {
            saved: savedCount.count ?? 0,
            recently_viewed: viewedCount.count ?? 0,
            who_viewed_me: viewersCount.count ?? 0,
            free_requests_left: freeLeft,
            free_requests_limit: freeLimit,
          },
          recommendations,
          recently_viewed: recentlyViewed,
          who_viewed_me: whoViewedMe,
          new_this_week: newThisWeek,
        });
      }

      case "record_view": {
        const target = Number(body.target_id);
        if (!target || target === profileId) return json({ success: true });
        await supabase.from("profile_views").insert({
          viewer_profile_id: profileId,
          viewed_profile_id: target,
        });
        return json({ success: true });
      }

      case "set_primary_photo": {
        const url = String(body.photo_url || "");
        const photos: string[] = Array.isArray(profile.photo_urls) ? profile.photo_urls : [];
        if (!url || !photos.includes(url))
          return json({ error: "Photo not found in your uploaded photos" }, 400);
        const reordered = [url, ...photos.filter((p) => p !== url)];
        const { error } = await supabase
          .from("profiles_data")
          .update({ photo_urls: reordered })
          .eq("id", profileId);
        if (error) return json({ error: error.message }, 400);
        return json({ success: true, photo_urls: reordered });
      }
        const target = Number(body.target_id);
        if (!target || target === profileId) return json({ success: true });
        await supabase.from("profile_views").insert({
          viewer_profile_id: profileId,
          viewed_profile_id: target,
        });
        return json({ success: true });
      }

      case "view_profile": {
        const target = Number(body.target_id);
        if (!target) return json({ error: "Invalid target" }, 400);
        const { data: targetProfile } = await supabase
          .from("profiles_data").select("*").eq("id", target).maybeSingle();
        if (!targetProfile) return json({ error: "Profile not found" }, 404);
        if (target !== profileId) {
          await supabase.from("profile_views").insert({
            viewer_profile_id: profileId,
            viewed_profile_id: target,
          });
        }
        const isSelf = target === profileId;
        return json({
          profile: sanitizeProfile(targetProfile, premium, isSelf),
          viewer_is_premium: premium,
          is_self: isSelf,
        });
      }

      case "list_who_viewed_me": {
        const { data: wvRows } = await supabase
          .from("profile_views")
          .select("viewer_profile_id, viewed_at")
          .eq("viewed_profile_id", profileId)
          .order("viewed_at", { ascending: false })
          .limit(50);
        const ids: number[] = [];
        const seen = new Set<number>();
        const times: Record<number, string> = {};
        for (const r of (wvRows ?? [])) {
          if (!seen.has(r.viewer_profile_id)) {
            seen.add(r.viewer_profile_id);
            ids.push(r.viewer_profile_id);
            times[r.viewer_profile_id] = r.viewed_at;
          }
        }
        const limited = premium ? ids : ids.slice(0, 4);
        const { data: profs } = limited.length
          ? await supabase.from("profiles_data").select("*").in("id", limited)
          : { data: [] as any[] };
        const result = limited.map((id) => {
          const p = profs?.find((x: any) => x.id === id);
          return p ? { ...sanitizeProfile(p, premium, false), viewed_at: times[id] } : null;
        }).filter(Boolean);
        return json({ viewers: result, total: ids.length, locked: !premium && ids.length > 4 });
      }

      case "list_recently_viewed": {
        const { data: rows } = await supabase
          .from("profile_views")
          .select("viewed_profile_id, viewed_at")
          .eq("viewer_profile_id", profileId)
          .order("viewed_at", { ascending: false })
          .limit(50);
        const ids: number[] = [];
        const seen = new Set<number>();
        const times: Record<number, string> = {};
        for (const r of (rows ?? [])) {
          if (!seen.has(r.viewed_profile_id)) {
            seen.add(r.viewed_profile_id);
            ids.push(r.viewed_profile_id);
            times[r.viewed_profile_id] = r.viewed_at;
          }
        }
        const { data: profs } = ids.length
          ? await supabase.from("profiles_data").select("*").in("id", ids)
          : { data: [] as any[] };
        const result = ids.map((id) => {
          const p = profs?.find((x: any) => x.id === id);
          return p ? { ...sanitizeProfile(p, premium, false), viewed_at: times[id] } : null;
        }).filter(Boolean);
        return json({ profiles: result });
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
          .ilike("verification_status", "verified");
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
          .ilike("verification_status", "verified")
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

      case "browse_all": {
        const wantGender = profile.gender === "Male" ? "Female" : profile.gender === "Female" ? "Male" : null;
        let q = supabase
          .from("profiles_data")
          .select("*")
          .ilike("verification_status", "verified")
          .eq("is_live", true)
          .neq("id", profileId)
          .order("created_at", { ascending: false })
          .limit(500);
        if (wantGender) q = q.eq("gender", wantGender);
        const { data } = await q;
        const sorted = (data ?? [])
          .sort((a: any, b: any) => Number(isPremium(b)) - Number(isPremium(a)))
          .map((p) => sanitizeProfile(p, premium, false));
        return json({ profiles: sorted, viewer_is_premium: premium });
      }

      default:
        return json({ error: "Unknown action" }, 400);
    }
  } catch (e: any) {
    console.error("member-dashboard error", e);
    return json({ error: e.message || "Server error" }, 500);
  }
});
