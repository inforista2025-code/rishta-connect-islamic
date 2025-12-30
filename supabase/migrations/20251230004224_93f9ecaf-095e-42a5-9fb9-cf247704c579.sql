
-- Create about_us_content table for multi-language content
CREATE TABLE public.about_us_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  language TEXT NOT NULL CHECK (language IN ('en', 'hi', 'ur')),
  title TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(language)
);

-- Enable Row Level Security
ALTER TABLE public.about_us_content ENABLE ROW LEVEL SECURITY;

-- Anyone can view about_us content (public page)
CREATE POLICY "Anyone can view about_us content" 
ON public.about_us_content 
FOR SELECT 
USING (true);

-- Only admins can insert
CREATE POLICY "Admins can insert about_us content" 
ON public.about_us_content 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update
CREATE POLICY "Admins can update about_us content" 
ON public.about_us_content 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete
CREATE POLICY "Admins can delete about_us content" 
ON public.about_us_content 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_about_us_content_timestamp
BEFORE UPDATE ON public.about_us_content
FOR EACH ROW
EXECUTE FUNCTION public.update_profiles_data_timestamp();

-- Insert placeholder content for each language
INSERT INTO public.about_us_content (language, title, content) VALUES
('en', 'About Rishta Matrimony', '<p>Welcome to Rishta Matrimony. Content coming soon...</p>'),
('hi', 'रिश्ता मैट्रिमोनी के बारे में', '<p>रिश्ता मैट्रिमोनी में आपका स्वागत है। सामग्री जल्द आ रही है...</p>'),
('ur', 'رشتہ میٹریمونی کے بارے میں', '<p>رشتہ میٹریمونی میں خوش آمدید۔ مواد جلد آ رہا ہے...</p>');
