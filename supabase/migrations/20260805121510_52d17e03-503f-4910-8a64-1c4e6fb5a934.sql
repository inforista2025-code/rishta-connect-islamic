ALTER TABLE public.profiles_data ADD COLUMN IF NOT EXISTS login_count integer NOT NULL DEFAULT 0;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS login_count integer NOT NULL DEFAULT 0;