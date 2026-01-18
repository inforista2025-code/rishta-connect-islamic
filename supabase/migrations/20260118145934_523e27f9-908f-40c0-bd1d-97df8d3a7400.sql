-- Create terms_content table for storing terms and conditions
CREATE TABLE public.terms_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.terms_content ENABLE ROW LEVEL SECURITY;

-- Public can read terms
CREATE POLICY "Anyone can view terms" 
ON public.terms_content 
FOR SELECT 
USING (true);

-- Only admins can update terms
CREATE POLICY "Admins can update terms" 
ON public.terms_content 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert terms
CREATE POLICY "Admins can insert terms" 
ON public.terms_content 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default empty row
INSERT INTO public.terms_content (content) VALUES ('');