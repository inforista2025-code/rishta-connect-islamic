# Member Dashboard Enhancement Plan

This is a large feature set. Login/OTP/session code stays untouched. All new functionality reads from existing `profiles_data` (verified profiles) and adds new tables for editable fields, saved profiles, interests, and update requests.

## 1. Database (new tables, all linked to existing `profiles_data.id`)

- `member_editable_profile` — 1:1 with profile. Fields: `profile_id` (PK FK), `about_me`, `partner_preferences`, `preferred_age_range`, `preferred_location`, `hobbies`, `additional_info`, `personal_introduction`, timestamps.
- `profile_update_requests` — `id`, `profile_id`, `field_name`, `current_value`, `requested_value`, `reason`, `status` (`pending`/`approved`/`rejected`), `admin_notes`, `reviewed_by`, timestamps.
- `saved_profiles` — `id`, `owner_profile_id`, `saved_profile_id`, `created_at`, unique pair.
- `profile_interests` — `id`, `sender_profile_id`, `receiver_profile_id`, `status` (`sent`/`accepted`/`declined`), `created_at`, unique pair.

RLS: members access only their own rows via session-validated edge functions (no auth.uid since members use OTP, not Supabase Auth). All writes go through edge functions using `service_role` after validating `session_token`. Public-read denied; grants tuned for service_role only.

## 2. Edge Functions (new, all validate `session_token` from `member_sessions`)

- `member-profile-get` — returns merged profile (verified + editable + completion %).
- `member-profile-update-editable` — updates `member_editable_profile`.
- `member-profile-request-update` — inserts row in `profile_update_requests`.
- `member-saved-profiles` — list/add/remove.
- `member-interests` — list sent/received, send interest (enforces 5/month for free), update status.
- `member-recommendations` — fetch profiles matching gender/location/age preference.
- `admin-update-requests` — admin-only list/approve/reject (validates admin via existing `has_role`).

## 3. Profile Completion (computed client-side from profile)

Weights total 100%: Photo 15, FullName 5, Email 5, WhatsApp 5, Location 10, Education 10, Occupation 10, FamilyDetails 10, IslamicKnowledge 5, PartnerPreferences 10, AboutMe 15. Missing items listed with "+X%" suggestions.

## 4. Frontend — Member Dashboard restructure

New layout with sidebar (shadcn sidebar) sections:
- **My Profile** — completion %, progress bar, missing suggestions, premium badge if applicable.
- **Edit Profile** — two clearly separated cards:
  - *Verified (Locked)* — each field shown with 🔒 + "Request Update" button → modal (current/requested/reason).
  - *Editable* — form for about_me, partner_preferences, preferred age/location, hobbies, additional info, personal intro — instant save.
- **Saved Profiles** — grid of cards, remove button.
- **Interests Sent / Received** — two tabs with profile snippets.
- **Recommended Profiles** — auto-matched cards.
- **Profile Update Requests** — list of own requests with status badges.
- **Upgrade to Premium** — CTA (free) or status (premium).

## 5. Profile cards (Profiles page + dashboard widgets)

Add `⭐ Save` and `❤️ Send Interest` actions. Premium cards get gradient border + soft glow + "⭐ Premium Verified" badge; sorted before free profiles. Free members see masked contact/biodata with upgrade CTA; premium see full details.

## 6. Free vs Premium gating

Centralised helper `canViewContact(member)`, `canSendInterest(member, sentThisMonth)`. Free cap = 5 interests/month; cap enforced server-side in `member-interests` function. Frontend shows upgrade prompt when blocked.

## 7. Admin Dashboard

New `Update Requests` tab in `AdminDashboard.tsx`: list pending requests, side-by-side old vs requested, Approve (writes to `profiles_data`) / Reject buttons. Reuses existing admin auth.

## 8. Out of scope (untouched)

- `member-login-request`, `member-login-verify`, `member-session-validate`
- `useMemberAuth`, `MemberProtectedRoute`, `MemberLogin`
- Existing pricing, registration, blog, about, terms, privacy flows

## Technical notes

- Member identity comes from `session_token` → `member_sessions.profile_data_id`. All new edge functions accept `{ session_token, ...payload }`.
- Recommendations query: opposite gender, location ILIKE preference, age within preferred range; falls back to recent verified profiles.
- Premium check: `plan_type === 'premium' && (!premium_expiry || premium_expiry > now)`.
- UI keeps current pink Islamic theme; premium uses purple accent per existing memory.

Confirm to proceed and I'll build it in stages (DB → edge functions → dashboard UI → profile-card actions → admin tab).
