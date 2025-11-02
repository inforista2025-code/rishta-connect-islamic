-- Fix search_path for update_profiles_order_timestamp function
DROP FUNCTION IF EXISTS public.update_profiles_order_timestamp() CASCADE;

CREATE OR REPLACE FUNCTION public.update_profiles_order_timestamp()
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

-- Recreate the trigger
CREATE TRIGGER update_profiles_order_timestamp_trigger
BEFORE UPDATE ON public.profiles_order
FOR EACH ROW
EXECUTE FUNCTION public.update_profiles_order_timestamp();