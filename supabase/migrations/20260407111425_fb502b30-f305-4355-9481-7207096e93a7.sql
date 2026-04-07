CREATE POLICY "Anyone can submit profiles_data"
ON public.profiles_data
FOR INSERT
TO anon, authenticated
WITH CHECK (true);