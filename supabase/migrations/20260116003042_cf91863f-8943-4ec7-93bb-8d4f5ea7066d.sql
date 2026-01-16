-- Add public SELECT policy for profiles_data so everyone can view profiles
CREATE POLICY "Anyone can view profiles_data" 
ON public.profiles_data 
FOR SELECT 
USING (true);

-- Add public SELECT policy for profiles_order so everyone can see profile ordering
CREATE POLICY "Anyone can view profiles_order" 
ON public.profiles_order 
FOR SELECT 
USING (true);