-- =====================================================
-- FINAL SECURITY CLEANUP - Remove permissive policies
-- =====================================================

-- 1. Remove permissive SELECT policies from profiles_data (make admin-only)
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles_data;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles_data;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles_data;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles_data;
DROP POLICY IF EXISTS "Only admins can view profiles_data" ON public.profiles_data;
DROP POLICY IF EXISTS "Only admins can insert profiles_data" ON public.profiles_data;
DROP POLICY IF EXISTS "Only admins can update profiles_data" ON public.profiles_data;
DROP POLICY IF EXISTS "Only admins can delete profiles_data" ON public.profiles_data;

-- Recreate admin-only policies for profiles_data
CREATE POLICY "Admin only - view profiles_data"
ON public.profiles_data FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin only - insert profiles_data"
ON public.profiles_data FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin only - update profiles_data"
ON public.profiles_data FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin only - delete profiles_data"
ON public.profiles_data FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Fix profiles_order - Remove permissive policies
DROP POLICY IF EXISTS "Anyone can view profile order" ON public.profiles_order;
DROP POLICY IF EXISTS "Authenticated users can update profile order" ON public.profiles_order;
DROP POLICY IF EXISTS "Only admins can view profiles_order" ON public.profiles_order;
DROP POLICY IF EXISTS "Only admins can insert profiles_order" ON public.profiles_order;
DROP POLICY IF EXISTS "Only admins can update profiles_order" ON public.profiles_order;
DROP POLICY IF EXISTS "Only admins can delete profiles_order" ON public.profiles_order;

-- Recreate admin-only policies for profiles_order
CREATE POLICY "Admin only - view profiles_order"
ON public.profiles_order FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin only - insert profiles_order"
ON public.profiles_order FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin only - update profiles_order"
ON public.profiles_order FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin only - delete profiles_order"
ON public.profiles_order FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Remove public view policy from registrations
DROP POLICY IF EXISTS "Public can view verified live profiles" ON public.registrations;