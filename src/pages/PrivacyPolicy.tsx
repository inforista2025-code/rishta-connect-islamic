import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
  const { data: privacyContent, isLoading } = useQuery({
    queryKey: ['privacy-policy-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('privacy_policy_content')
        .select('content')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data?.content || '';
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Privacy Policy - Rishta Matrimony</title>
        <meta name="description" content="Read the privacy policy for Rishta Matrimony services." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Privacy Policy
          </h1>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : privacyContent ? (
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: privacyContent }}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Privacy Policy content will be available soon.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
