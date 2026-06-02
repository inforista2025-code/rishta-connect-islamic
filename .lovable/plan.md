## Member Authentication System

Build a member login system that authenticates users against existing verified `registrations` records via WhatsApp number + email OTP, with single-device session enforcement.

### Scope & Rules
- Use existing `registrations` table (no new user table, no Supabase Auth signup).
- Only `verification_status = 'verified'` profiles can log in.
- Pending/Rejected → "Your profile is not verified yet. Please wait for admin approval."
- Not found → "Account not found or not verified."
- Free plan → Free Member Dashboard. Premium plan → Premium Member Dashboard.
- Single active session: new login invalidates previous device's session.
- Auto-logout after long inactivity (30 days idle / 90 days absolute).

### Database (migration)

1. Add columns to `registrations`:
   - `last_login_at timestamptz`
   - `active_session_id uuid`
   - `active_device_info jsonb`

2. New table `member_otps`:
   - `id`, `registration_id`, `email`, `code_hash`, `expires_at`, `attempts`, `consumed_at`, `created_at`
   - RLS: anon INSERT/SELECT/UPDATE allowed only via secure edge functions (use service role inside edge functions); deny direct client access.

3. New table `member_sessions`:
   - `id (session token uuid)`, `registration_id`, `device_info jsonb`, `created_at`, `last_active_at`, `expires_at`, `revoked_at`
   - Single-active enforced in edge function: on issue, revoke all other rows for that registration.

### Edge Functions (3)

1. `member-login-request` — input: `whatsapp_number`. Looks up verified registration. If not found/not verified, returns the appropriate message. Generates 6-digit OTP, stores hash, sends email via existing Resend setup.
2. `member-login-verify` — input: `whatsapp_number`, `code`, `device_info`. Validates OTP, creates new session, revokes prior sessions, returns `{ session_token, registration, plan_type }`.
3. `member-session-validate` — input: `session_token`. Returns current registration + plan + revoked flag. Updates `last_active_at`.

All functions use service role internally; CORS enabled; `verify_jwt = false`.

### Frontend

Routes added in `App.tsx`:
- `/member/login` — WhatsApp input + OTP step (single page, 2 stages).
- `/member/dashboard` — auto-routes to Free or Premium view based on plan.
- `/member/premium` — Premium dashboard placeholder (extensible).

Components:
- `src/pages/MemberLogin.tsx` — clean UI: heading "Member Login", description, WhatsApp field, Continue button, "Don't have an account? Register Now" link. After Continue → OTP screen: "Verify Your Account", code field, Verify + Back buttons.
- `src/pages/MemberDashboard.tsx` — Free member view (welcome, profile summary, upgrade CTA).
- `src/pages/PremiumDashboard.tsx` — Premium view (welcome, premium badge, expiry, profile summary).
- `src/hooks/useMemberAuth.ts` — central hook. Stores `session_token` in `localStorage`. On mount, calls `member-session-validate`; if revoked or expired → clears + redirects to login. Polls every 60s to detect remote logout (single-device enforcement).
- `src/components/MemberProtectedRoute.tsx` — wraps dashboard routes.

Navbar: add a "Member Login" link (only when not logged in as member) and "Logout" + "My Dashboard" when logged in.

### Future Compatibility
Session-based design with `registration_id` as the stable user identity. Saved Profiles, Interests, Recommendations, etc. can later add tables keyed by `registration_id` — no login changes needed.

### Technical Notes
- OTP: 6 digits, 10-minute expiry, max 5 attempts.
- Code hashed (SHA-256) before storage.
- Session token: random UUID v4, 30-day idle expiry, refreshed on activity.
- Email uses existing `send-registration-emails` pattern (Resend, RESEND_API_KEY already configured).
- All client calls go through edge functions; no direct DB writes from client for auth state.

Shall I proceed with the migration and implementation?