-- Single-profile (₹48) unlocks: which member has unlocked which target profile.
-- Plus payment metadata on profile_update_requests so admin can approve payments.

ALTER TABLE public.profile_update_requests
  ADD COLUMN IF NOT EXISTS request_type TEXT NOT NULL DEFAULT 'field_update',
  ADD COLUMN IF NOT EXISTS target_profile_id INTEGER REFERENCES public.profiles_data(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS amount INTEGER;

CREATE INDEX IF NOT EXISTS idx_profile_update_requests_type ON public.profile_update_requests(request_type);

CREATE TABLE IF NOT EXISTS public.profile_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_profile_id INTEGER NOT NULL REFERENCES public.profiles_data(id) ON DELETE CASCADE,
  target_profile_id INTEGER NOT NULL REFERENCES public.profiles_data(id) ON DELETE CASCADE,
  request_id UUID REFERENCES public.profile_update_requests(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL DEFAULT 48,
  approved_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (member_profile_id, target_profile_id)
);

GRANT ALL ON public.profile_unlocks TO service_role;
ALTER TABLE public.profile_unlocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only unlocks" ON public.profile_unlocks FOR ALL USING (false) WITH CHECK (false);
CREATE INDEX IF NOT EXISTS idx_profile_unlocks_member ON public.profile_unlocks(member_profile_id);
