-- Create registrations table as the main source of truth
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Personal Information (Step 1)
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  height TEXT NOT NULL,
  caste TEXT NOT NULL,
  complexion TEXT NOT NULL,
  marital_status TEXT NOT NULL,
  maslak TEXT NOT NULL,
  
  -- Residence & Career (Step 2)
  residence_location TEXT NOT NULL,
  education_details TEXT NOT NULL,
  occupation_details TEXT NOT NULL,
  family_details TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  
  -- Partner Preferences (Step 3)
  preferred_age_range TEXT NOT NULL,
  preferred_location TEXT NOT NULL,
  partner_preferences TEXT NOT NULL,
  islamic_education TEXT,
  other_info TEXT,
  
  -- Files
  photo_urls TEXT[] NOT NULL DEFAULT '{}',
  biodata_url TEXT,
  
  -- Metadata
  referral TEXT,
  
  -- Verification & Display Status
  verification_status TEXT NOT NULL DEFAULT 'pending',
  is_live BOOLEAN NOT NULL DEFAULT false,
  admin_notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit registration
CREATE POLICY "Anyone can submit registration"
ON public.registrations
FOR INSERT
WITH CHECK (true);

-- Policy: Admins can view all registrations
CREATE POLICY "Admins can view all registrations"
ON public.registrations
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can update registrations
CREATE POLICY "Admins can update registrations"
ON public.registrations
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can delete registrations
CREATE POLICY "Admins can delete registrations"
ON public.registrations
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Public can view only verified and live profiles
CREATE POLICY "Public can view verified live profiles"
ON public.registrations
FOR SELECT
USING (verification_status = 'verified' AND is_live = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_registrations_updated_at
BEFORE UPDATE ON public.registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_registration_timestamp();