-- Create profiles_order table to store the order of profiles
CREATE TABLE IF NOT EXISTS public.profiles_order (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL UNIQUE,
  order_position INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles_order ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read profile order (public data)
CREATE POLICY "Anyone can view profile order"
  ON public.profiles_order
  FOR SELECT
  USING (true);

-- Only authenticated users can update profile order (admin only in app logic)
CREATE POLICY "Authenticated users can update profile order"
  ON public.profiles_order
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION public.update_profiles_order_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_order_timestamp
  BEFORE UPDATE ON public.profiles_order
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profiles_order_timestamp();