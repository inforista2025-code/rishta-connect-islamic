-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create profiles table to store profile data
CREATE TABLE public.profiles_data (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    gender TEXT NOT NULL,
    age TEXT NOT NULL,
    dob TEXT NOT NULL,
    location TEXT NOT NULL,
    height TEXT NOT NULL,
    complexion TEXT NOT NULL,
    education TEXT NOT NULL,
    profession TEXT NOT NULL,
    marital_status TEXT NOT NULL,
    caste TEXT,
    maslak TEXT,
    islamic_knowledge TEXT,
    family TEXT NOT NULL,
    preferred_partner TEXT NOT NULL,
    preferred_location TEXT NOT NULL,
    preferred_age TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles_data
ALTER TABLE public.profiles_data ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read profiles
CREATE POLICY "Anyone can view profiles"
ON public.profiles_data
FOR SELECT
TO authenticated, anon
USING (true);

-- Only admins can insert, update, delete profiles
CREATE POLICY "Admins can insert profiles"
ON public.profiles_data
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update profiles"
ON public.profiles_data
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete profiles"
ON public.profiles_data
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_profiles_data_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_data_updated_at
BEFORE UPDATE ON public.profiles_data
FOR EACH ROW
EXECUTE FUNCTION public.update_profiles_data_timestamp();

-- Enable realtime for profiles_data
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles_data;