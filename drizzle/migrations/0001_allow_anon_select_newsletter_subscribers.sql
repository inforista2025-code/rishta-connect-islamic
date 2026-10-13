GRANT SELECT ON public.newsletter_subscribers TO anon;

CREATE POLICY "Public can read newsletter subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO anon
USING (true);