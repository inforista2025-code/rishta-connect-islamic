
-- Add plan_type and premium_expiry to registrations table
ALTER TABLE public.registrations 
ADD COLUMN plan_type text NOT NULL DEFAULT 'free',
ADD COLUMN premium_expiry timestamp with time zone DEFAULT NULL;

-- Add plan_type and premium_expiry to profiles_data table
ALTER TABLE public.profiles_data 
ADD COLUMN plan_type text NOT NULL DEFAULT 'free',
ADD COLUMN premium_expiry timestamp with time zone DEFAULT NULL;
