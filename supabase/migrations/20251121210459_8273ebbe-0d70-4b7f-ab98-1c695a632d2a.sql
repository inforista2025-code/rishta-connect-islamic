-- Create registration_submissions table for storing new profile registrations
CREATE TABLE public.registration_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  full_name text NOT NULL,
  gender text NOT NULL,
  date_of_birth date NOT NULL,
  height text NOT NULL,
  caste text NOT NULL,
  complexion text NOT NULL,
  marital_status text NOT NULL,
  maslak text NOT NULL,
  residence_location text NOT NULL,
  education_details text NOT NULL,
  occupation_details text NOT NULL,
  family_details text NOT NULL,
  whatsapp_number text NOT NULL,
  preferred_age_range text NOT NULL,
  preferred_location text NOT NULL,
  partner_preferences text NOT NULL,
  islamic_education text,
  other_info text,
  photo_urls text[] NOT NULL,
  biodata_url text,
  referral text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.registration_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert their own registration
CREATE POLICY "Anyone can submit registration"
ON public.registration_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Admins can view all registrations
CREATE POLICY "Admins can view all registrations"
ON public.registration_submissions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can update registration status
CREATE POLICY "Admins can update registrations"
ON public.registration_submissions
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for registration photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('registration-photos', 'registration-photos', false);

-- Storage policies for registration photos
CREATE POLICY "Anyone can upload registration photos"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'registration-photos');

CREATE POLICY "Admins can view registration photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'registration-photos' AND has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for biodatas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('registration-biodatas', 'registration-biodatas', false);

-- Storage policies for biodatas
CREATE POLICY "Anyone can upload biodatas"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'registration-biodatas');

CREATE POLICY "Admins can view biodatas"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'registration-biodatas' AND has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_registration_timestamp()
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

CREATE TRIGGER update_registration_submissions_updated_at
BEFORE UPDATE ON public.registration_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_registration_timestamp();