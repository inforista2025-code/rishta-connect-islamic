import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Language = 'en' | 'hi' | 'ur';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
];

export default function AboutUs() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const { data: content, isLoading } = useQuery({
    queryKey: ['about-us-content', currentLanguage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_us_content')
        .select('*')
        .eq('language', currentLanguage)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const currentLang = languages.find(l => l.code === currentLanguage);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Language Selector */}
        <div className="flex justify-end mb-8">
          <Select value={currentLanguage} onValueChange={(value: Language) => setCurrentLanguage(value)}>
            <SelectTrigger className="w-[180px] bg-background border-border">
              <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue>
                {currentLang && (
                  <span className="flex items-center gap-2">
                    <span>{currentLang.flag}</span>
                    <span>{currentLang.nativeName}</span>
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-background border-border z-50">
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : content ? (
          <div className={`max-w-4xl mx-auto ${currentLanguage === 'ur' ? 'text-right' : ''}`} dir={currentLanguage === 'ur' ? 'rtl' : 'ltr'}>
            <h1 className="text-4xl font-bold text-foreground mb-8">{content.title}</h1>
            <div 
              className="prose prose-lg max-w-none text-foreground/80"
              dangerouslySetInnerHTML={{ __html: content.content || '' }}
            />
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p>Content not available. Please check back later.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
