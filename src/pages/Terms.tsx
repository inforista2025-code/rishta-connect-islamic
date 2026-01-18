import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function Terms() {
  const { data: termsContent, isLoading } = useQuery({
    queryKey: ['terms-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('terms_content')
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
        <title>Terms & Conditions - Rishta Matrimony</title>
        <meta name="description" content="Read the terms and conditions for using Rishta Matrimony services." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Terms & Conditions
          </h1>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : termsContent ? (
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: termsContent }}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Terms & Conditions content will be available soon.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}