CREATE TABLE IF NOT EXISTS public.profile_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_profile_id integer NOT NULL,
  viewed_profile_id integer NOT NULL,
  viewed_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.profile_views TO service_role;
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only_profile_views" ON public.profile_views FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewer ON public.profile_views (viewer_profile_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed ON public.profile_views (viewed_profile_id, viewed_at DESC);