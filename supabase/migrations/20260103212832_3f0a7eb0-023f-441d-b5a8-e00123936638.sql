-- Add registration_id column to profiles_data to link back to registrations
ALTER TABLE public.profiles_data ADD COLUMN IF NOT EXISTS registration_id uuid REFERENCES public.registrations(id) ON DELETE CASCADE;

-- Create unique index to prevent duplicate profiles from same registration
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_data_registration_id ON public.profiles_data(registration_id) WHERE registration_id IS NOT NULL;