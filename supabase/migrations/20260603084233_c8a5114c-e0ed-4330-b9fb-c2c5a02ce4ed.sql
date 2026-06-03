ALTER TABLE public.profiles_data
  ADD COLUMN IF NOT EXISTS last_login_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS active_session_id uuid,
  ADD COLUMN IF NOT EXISTS active_device_info jsonb;