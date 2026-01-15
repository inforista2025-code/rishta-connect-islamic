-- =====================================================
-- COMPREHENSIVE SECURITY FIX - PART 2
-- =====================================================

-- 5. DROP ALL EXISTING POLICIES ON registrations (including the one that already exists)
DROP POLICY IF EXISTS "Anyone can submit registration" ON public.registrations;
DROP POLICY IF EXISTS "Only admins can view registrations" ON public.registrations;
DROP POLICY IF EXISTS "Only admins can update registrations" ON public.registrations;
DROP POLICY IF EXISTS "Only admins can delete registrations" ON public.registrations;

-- 6. CREATE SECURE POLICIES FOR registrations
CREATE POLICY "Anyone can submit registration"
ON public.registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Only admins can view registrations"
ON public.registrations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update registrations"
ON public.registrations
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete registrations"
ON public.registrations
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 7. DROP ALL EXISTING POLICIES ON registration_submissions
DROP POLICY IF EXISTS "Anyone can insert submissions" ON public.registration_submissions;
DROP POLICY IF EXISTS "Admins can view submissions" ON public.registration_submissions;
DROP POLICY IF EXISTS "Public can insert registration_submissions" ON public.registration_submissions;
DROP POLICY IF EXISTS "Anyone can submit registration_submissions" ON public.registration_submissions;
DROP POLICY IF EXISTS "Only admins can view registration_submissions" ON public.registration_submissions;
DROP POLICY IF EXISTS "Only admins can update registration_submissions" ON public.registration_submissions;
DROP POLICY IF EXISTS "Only admins can delete registration_submissions" ON public.registration_submissions;

-- 8. CREATE SECURE POLICIES FOR registration_submissions
CREATE POLICY "Anyone can submit registration_submissions"
ON public.registration_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Only admins can view registration_submissions"
ON public.registration_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update registration_submissions"
ON public.registration_submissions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete registration_submissions"
ON public.registration_submissions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 9. SECURE STORAGE BUCKETS - DROP EXISTING POLICIES
DROP POLICY IF EXISTS "Anyone can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload biodatas" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view biodatas" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload to registration-photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view registration-photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload to registration-biodatas" ON storage.objects;
DROP POLICY IF EXISTS "Public can view registration-biodatas" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload registration photos" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can view registration photos" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can delete registration photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload registration biodatas" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can view registration biodatas" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can delete registration biodatas" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can delete blog images" ON storage.objects;

-- 10. CREATE SECURE STORAGE POLICIES
-- Registration photos - anyone can upload (for form) but only admins can view
CREATE POLICY "Anyone can upload registration photos"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'registration-photos');

CREATE POLICY "Only admins can view registration photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'registration-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete registration photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'registration-photos' AND public.has_role(auth.uid(), 'admin'));

-- Registration biodatas - anyone can upload (for form) but only admins can view
CREATE POLICY "Anyone can upload registration biodatas"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'registration-biodatas');

CREATE POLICY "Only admins can view registration biodatas"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'registration-biodatas' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete registration biodatas"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'registration-biodatas' AND public.has_role(auth.uid(), 'admin'));

-- Blog images - public read, admin write
CREATE POLICY "Anyone can view blog images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'blog-images');

CREATE POLICY "Only admins can upload blog images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete blog images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

-- 11. ENSURE user_roles IS PROPERLY SECURED
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can manage user roles" ON public.user_roles;

CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));