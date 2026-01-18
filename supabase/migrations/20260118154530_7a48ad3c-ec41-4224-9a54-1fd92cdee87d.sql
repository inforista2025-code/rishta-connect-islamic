-- Create privacy_policy_content table
CREATE TABLE public.privacy_policy_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.privacy_policy_content ENABLE ROW LEVEL SECURITY;

-- Anyone can view privacy policy
CREATE POLICY "Anyone can view privacy policy" 
ON public.privacy_policy_content 
FOR SELECT 
USING (true);

-- Admins can insert privacy policy
CREATE POLICY "Admins can insert privacy policy" 
ON public.privacy_policy_content 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update privacy policy
CREATE POLICY "Admins can update privacy policy" 
ON public.privacy_policy_content 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));