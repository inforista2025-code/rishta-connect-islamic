
-- 1. member_editable_profile
CREATE TABLE public.member_editable_profile (
  profile_id INTEGER PRIMARY KEY REFERENCES public.profiles_data(id) ON DELETE CASCADE,
  about_me TEXT,
  partner_preferences TEXT,
  preferred_age_range TEXT,
  preferred_location TEXT,
  hobbies TEXT,
  additional_info TEXT,
  personal_introduction TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.member_editable_profile TO service_role;
ALTER TABLE public.member_editable_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only" ON public.member_editable_profile FOR ALL USING (false) WITH CHECK (false);

-- 2. profile_update_requests
CREATE TABLE public.profile_update_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id INTEGER NOT NULL REFERENCES public.profiles_data(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  current_value TEXT,
  requested_value TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.profile_update_requests TO service_role;
GRANT SELECT, UPDATE ON public.profile_update_requests TO authenticated;
ALTER TABLE public.profile_update_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins can read update requests" ON public.profile_update_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can update update requests" ON public.profile_update_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_profile_update_requests_profile ON public.profile_update_requests(profile_id);
CREATE INDEX idx_profile_update_requests_status ON public.profile_update_requests(status);

-- 3. saved_profiles
CREATE TABLE public.saved_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_profile_id INTEGER NOT NULL REFERENCES public.profiles_data(id) ON DELETE CASCADE,
  saved_profile_id INTEGER NOT NULL REFERENCES public.profiles_data(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (owner_profile_id, saved_profile_id)
);
GRANT ALL ON public.saved_profiles TO service_role;
ALTER TABLE public.saved_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only saved" ON public.saved_profiles FOR ALL USING (false) WITH CHECK (false);
CREATE INDEX idx_saved_profiles_owner ON public.saved_profiles(owner_profile_id);

-- 4. profile_interests
CREATE TABLE public.profile_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_profile_id INTEGER NOT NULL REFERENCES public.profiles_data(id) ON DELETE CASCADE,
  receiver_profile_id INTEGER NOT NULL REFERENCES public.profiles_data(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (sender_profile_id, receiver_profile_id)
);
GRANT ALL ON public.profile_interests TO service_role;
ALTER TABLE public.profile_interests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only interests" ON public.profile_interests FOR ALL USING (false) WITH CHECK (false);
CREATE INDEX idx_profile_interests_sender ON public.profile_interests(sender_profile_id);
CREATE INDEX idx_profile_interests_receiver ON public.profile_interests(receiver_profile_id);
CREATE INDEX idx_profile_interests_created ON public.profile_interests(created_at);

-- Shared updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_member_editable_profile_updated BEFORE UPDATE ON public.member_editable_profile FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_profile_update_requests_updated BEFORE UPDATE ON public.profile_update_requests FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_profile_interests_updated BEFORE UPDATE ON public.profile_interests FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
