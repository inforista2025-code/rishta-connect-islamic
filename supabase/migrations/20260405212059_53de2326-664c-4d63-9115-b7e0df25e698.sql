
-- Add missing columns to profiles_data
ALTER TABLE public.profiles_data
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS whatsapp_number text,
  ADD COLUMN IF NOT EXISTS photo_urls text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS biodata_url text,
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS is_live boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS other_info text,
  ADD COLUMN IF NOT EXISTS date_of_birth date;

-- Update existing profiles to be verified and live (they were already synced from registrations)
UPDATE public.profiles_data SET verification_status = 'verified', is_live = true WHERE verification_status = 'pending';

-- Backfill email, whatsapp, photos from linked registrations
UPDATE public.profiles_data pd
SET 
  email = r.email,
  whatsapp_number = r.whatsapp_number,
  photo_urls = r.photo_urls,
  biodata_url = r.biodata_url,
  other_info = r.other_info,
  date_of_birth = r.date_of_birth
FROM public.registrations r
WHERE pd.registration_id = r.id;
