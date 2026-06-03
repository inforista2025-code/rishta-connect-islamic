ALTER TABLE public.member_otps
  ALTER COLUMN registration_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS profile_data_id integer;

ALTER TABLE public.member_sessions
  ALTER COLUMN registration_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS profile_data_id integer;

CREATE INDEX IF NOT EXISTS idx_member_otps_profile_data_id ON public.member_otps(profile_data_id);
CREATE INDEX IF NOT EXISTS idx_member_sessions_profile_data_id ON public.member_sessions(profile_data_id);

ALTER TABLE public.member_otps
  DROP CONSTRAINT IF EXISTS member_otps_existing_member_check;

ALTER TABLE public.member_otps
  ADD CONSTRAINT member_otps_existing_member_check
  CHECK (
    (registration_id IS NOT NULL AND profile_data_id IS NULL)
    OR
    (registration_id IS NULL AND profile_data_id IS NOT NULL)
  );

ALTER TABLE public.member_sessions
  DROP CONSTRAINT IF EXISTS member_sessions_existing_member_check;

ALTER TABLE public.member_sessions
  ADD CONSTRAINT member_sessions_existing_member_check
  CHECK (
    (registration_id IS NOT NULL AND profile_data_id IS NULL)
    OR
    (registration_id IS NULL AND profile_data_id IS NOT NULL)
  );