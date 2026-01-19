import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Globe } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
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

// Function to format plain text content with proper styling
const formatContent = (text: string | null) => {
  if (!text) return [];
  
  // Split by double newlines to get paragraphs/sections
  const sections = text.split(/\n\n+/);
  
  return sections.map((section, index) => {
    const trimmedSection = section.trim();
    if (!trimmedSection) return null;
    
    // Check if it's a heading (starts with # or all caps or ends with :)
    const isHeading = 
      trimmedSection.startsWith('#') || 
      trimmedSection.match(/^[A-Z\s]{10,}$/) ||
      (trimmedSection.length < 100 && trimmedSection.endsWith(':'));
    
    // Check if it's a bullet list
    const isBulletList = trimmedSection.split('\n').every(line => 
      line.trim().startsWith('-') || 
      line.trim().startsWith('•') || 
      line.trim().startsWith('*') ||
      line.trim() === ''
    );
    
    if (isHeading) {
      const headingText = trimmedSection.replace(/^#+\s*/, '').replace(/:$/, '');
      return {
        type: 'heading',
        content: headingText,
        key: index
      };
    }
    
    if (isBulletList) {
      const items = trimmedSection
        .split('\n')
        .map(line => line.trim().replace(/^[-•*]\s*/, ''))
        .filter(line => line.length > 0);
      return {
        type: 'bullets',
        content: items,
        key: index
      };
    }
    
    // Regular paragraph - split by single newlines
    const lines = trimmedSection.split('\n').filter(line => line.trim());
    return {
      type: 'paragraph',
      content: lines,
      key: index
    };
  }).filter(Boolean);
};

export default function AboutUs() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const { data: content, isLoading, error } = useQuery({
    queryKey: ['about-us-content', currentLanguage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_us_content')
        .select('*')
        .eq('language', currentLanguage)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  // Check if content contains HTML
  const isHtmlContent = content?.content?.includes('<') && content?.content?.includes('>');
  const formattedContent = isHtmlContent ? null : formatContent(content?.content);

  const currentLang = languages.find(l => l.code === currentLanguage);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {/* Language Selector */}
        <div className="flex justify-end mb-6 md:mb-8">
          <Select value={currentLanguage} onValueChange={(value: Language) => setCurrentLanguage(value)}>
            <SelectTrigger className="w-[160px] md:w-[180px] bg-background border-border">
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
          <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
            <Skeleton className="h-12 w-64 mb-8" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <div className="pt-8">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>
            <div className="pt-8">
              <Skeleton className="h-8 w-40 mb-4" />
              <div className="space-y-3 pl-6">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            </div>
          </div>
        ) : content ? (
          <div 
            className={`max-w-4xl mx-auto ${currentLanguage === 'ur' ? 'text-right' : ''}`} 
            dir={currentLanguage === 'ur' ? 'rtl' : 'ltr'}
          >
            {/* Main Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 md:mb-12">
              {content.title}
            </h1>
            
            {/* Formatted Content */}
            {isHtmlContent ? (
              <div 
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-li:text-foreground/80 prose-strong:text-foreground"
                dangerouslySetInnerHTML={{ __html: content.content || '' }}
              />
            ) : (
              <div className="space-y-8 md:space-y-12">
                {formattedContent?.map((section: any) => {
                  if (!section) return null;
                  
                  if (section.type === 'heading') {
                    return (
                      <h2 
                        key={section.key} 
                        className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mt-12 md:mt-16 first:mt-0 border-b border-border/30 pb-3"
                      >
                        {section.content}
                      </h2>
                    );
                  }
                  
                  if (section.type === 'bullets') {
                    return (
                      <ul 
                        key={section.key} 
                        className={`space-y-3 md:space-y-4 ${currentLanguage === 'ur' ? 'pr-4 md:pr-6' : 'pl-4 md:pl-6'}`}
                      >
                        {section.content.map((item: string, idx: number) => (
                          <li 
                            key={idx} 
                            className="text-base md:text-lg text-foreground/80 leading-relaxed flex items-start gap-3"
                          >
                            <span className="text-primary mt-1.5 text-sm">●</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  
                  // Paragraph
                  return (
                    <div key={section.key} className="space-y-4">
                      {section.content.map((line: string, idx: number) => (
                        <p 
                          key={idx} 
                          className="text-base md:text-lg lg:text-xl text-foreground/80 leading-relaxed md:leading-loose"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">Content not available. Please check back later.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}