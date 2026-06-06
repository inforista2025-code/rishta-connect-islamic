## Member Dashboard Rebuild

Redesign `MemberDashboardHome` to closely match the reference image while keeping the existing login/OTP/session intact, and add new functional features.

### New database table
`profile_views` — tracks every profile view for "Recently Viewed" and "Who Viewed Me".
- `viewer_profile_id` (int) — who viewed
- `viewed_profile_id` (int) — who was viewed
- `viewed_at` (timestamptz)
- Index on (viewer_profile_id, viewed_at desc) and (viewed_profile_id, viewed_at desc)
- RLS: deny all to anon/authenticated (edge function uses service role)
- GRANT to service_role only

### Edge function changes (`member-dashboard`)
Add actions:
- `dashboard_summary` — single call returning profile + completion + counts (saved, recently_viewed, who_viewed_me, free_interests_left) + recommendations + recently viewed list + who viewed me list + new profiles this week
- `record_view` — { target_id } → insert into `profile_views`
- `list_recently_viewed` — distinct latest viewed profiles
- `list_who_viewed_me` — distinct latest viewers (limit/mask for free)
- `view_profile` — returns full profile if premium/owner else masked basic-only payload + records view

Update `sanitizeProfile` so free members get **blurred placeholder** photo URL hint (`photo_blurred: true`) instead of original. Photos still excluded from payload for free viewers; UI renders blur overlay over a placeholder.

### Frontend layout (`MemberDashboardHome.tsx` full rewrite)
Three-column responsive layout (collapses on mobile):
- **Left sidebar** (sticky): member photo, name, Verified badge, dropdown, nav list (Dashboard, My Profile, Search Profiles, Recommended, Saved, Recently Viewed, Received Interests, Sent Interests, Messages, Who Viewed Me, My Activity, Account Settings), Profile Completion widget at bottom with "Complete Now" CTA.
- **Center column**: pink-tinted greeting card "Assalamualaikum, {name}!" + 4 stat tiles (Profile Status, Saved, Recently Viewed, Free Requests Left). Below: "Recommended For You" card row with match%, photo, basic info, View Profile + Save. Below: side-by-side "New Profiles This Week" and "Recently Viewed Profiles" lists.
- **Right column**: Upgrade to Premium card (gold/cream gradient, crown icon, benefit checks, ₹491/2 Months, Upgrade Now). Below: Profile Tips card. Below: Who Viewed Me preview.

Active section state controls center content. Other sections (My Profile/Edit, Saved, Recently Viewed, Received/Sent Interests, Who Viewed Me, My Activity, Account Settings, Update Requests) replace center column when selected, keeping sidebar + right column.

### Photo & view-profile gating
- `ProfilePhoto` component: premium/self → real photo; free → CSS-blurred photo with lock overlay + "Upgrade to view".
- `View Profile` button:
  - Free → opens dialog with basic info only (name, age, location, education, profession, marital status), masked contact, big "Unlock Full Profile" CTA → /pricing. Records view server-side.
  - Premium → navigates to existing `/profiles` detail view (or in-dashboard dialog with full data including biodata link).
  - In both cases calls `record_view` first.

### Profile completion
Server already computes; render circular/linear progress in sidebar widget + on greeting card.

### Update requests
Keep existing flow; expose under "My Profile" → "Request Update" buttons next to locked fields, plus a dedicated section in nav.

### Match percentage
Computed client-side: simple heuristic from shared location/education/marital_status overlap (e.g. base 70 + 10 per match), capped 99%. Deterministic per profile pair.

### Files
- New migration: `profile_views` table + grants + RLS
- Edited: `supabase/functions/member-dashboard/index.ts` (new actions, sanitize tweak)
- Rewritten: `src/components/member/MemberDashboardHome.tsx`
- New: `src/components/member/DashboardSidebar.tsx`, `src/components/member/PremiumUpgradeCard.tsx`, `src/components/member/ProfilePhoto.tsx`, `src/components/member/ViewProfileDialog.tsx`, `src/components/member/RecommendedCard.tsx`
- `useMemberApi.ts`: unchanged (generic `call`)

### Out of scope
Login, OTP, session, pricing pages, registration, admin dashboard (UpdateRequestsManager already exists). Messaging is shown as "Coming soon".
