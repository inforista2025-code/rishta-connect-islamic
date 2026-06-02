-- Add session tracking columns to registrations
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS last_login_at timestamptz,
  ADD COLUMN IF NOT EXISTS active_session_id uuid,
  ADD COLUMN IF NOT EXISTS active_device_info jsonb;

-- OTPs table
CREATE TABLE public.member_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL,
  email text NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.member_otps TO service_role;
ALTER TABLE public.member_otps ENABLE ROW LEVEL SECURITY;
-- No anon/authenticated policies — accessed only via edge functions using service role.

CREATE INDEX idx_member_otps_registration ON public.member_otps(registration_id, created_at DESC);

-- Sessions table
CREATE TABLE public.member_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL,
  device_info jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_active_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz
);

GRANT ALL ON public.member_sessions TO service_role;
ALTER TABLE public.member_sessions ENABLE ROW LEVEL SECURITY;
-- No anon/authenticated policies — accessed only via edge functions using service role.

CREATE INDEX idx_member_sessions_registration ON public.member_sessions(registration_id);