import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

type Language = 'en' | 'hi' | 'ur';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
];

export function AboutUsManager() {
  const [activeLanguage, setActiveLanguage] = useState<Language>('en');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contents, isLoading } = useQuery({
    queryKey: ['about-us-content-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_us_content')
        .select('*');

      if (error) throw error;
      return data;
    },
  });

  const [formData, setFormData] = useState<Record<Language, { title: string; content: string }>>({
    en: { title: '', content: '' },
    hi: { title: '', content: '' },
    ur: { title: '', content: '' },
  });

  // Update form data when contents load
  useState(() => {
    if (contents) {
      const newFormData = { ...formData };
      contents.forEach((item) => {
        const lang = item.language as Language;
        newFormData[lang] = {
          title: item.title || '',
          content: item.content || '',
        };
      });
      setFormData(newFormData);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ language, title, content }: { language: Language; title: string; content: string }) => {
      const { error } = await supabase
        .from('about_us_content')
        .upsert(
          { language, title, content, updated_at: new Date().toISOString() },
          { onConflict: 'language' }
        );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-us-content-all'] });
      queryClient.invalidateQueries({ queryKey: ['about-us-content'] });
      toast({ title: 'Content saved successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error saving content', description: error.message, variant: 'destructive' });
    },
  });

  const handleSave = (language: Language) => {
    updateMutation.mutate({
      language,
      title: formData[language].title,
      content: formData[language].content,
    });
  };

  const getContent = (language: Language) => {
    const item = contents?.find(c => c.language === language);
    return {
      title: item?.title || '',
      content: item?.content || '',
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">About Us Content Manager</h2>
        <p className="text-muted-foreground mt-1">
          Manage your About Us page content in multiple languages
        </p>
      </div>

      <Tabs value={activeLanguage} onValueChange={(v) => setActiveLanguage(v as Language)}>
        <TabsList className="mb-6">
          {languages.map((lang) => (
            <TabsTrigger key={lang.code} value={lang.code} className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {languages.map((lang) => {
          const currentContent = getContent(lang.code as Language);
          
          return (
            <TabsContent key={lang.code} value={lang.code}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name} Content</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input
                      value={formData[lang.code as Language]?.title || currentContent.title}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        [lang.code]: { ...prev[lang.code as Language], title: e.target.value }
                      }))}
                      placeholder={`Enter title in ${lang.name}`}
                      dir={lang.code === 'ur' ? 'rtl' : 'ltr'}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Content (HTML supported)
                    </label>
                    <Textarea
                      value={formData[lang.code as Language]?.content || currentContent.content}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        [lang.code]: { ...prev[lang.code as Language], content: e.target.value }
                      }))}
                      placeholder={`Enter content in ${lang.name}. You can use HTML tags like <p>, <h2>, <ul>, <li>, etc.`}
                      rows={15}
                      dir={lang.code === 'ur' ? 'rtl' : 'ltr'}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Tip: Use HTML tags for formatting. Example: &lt;h2&gt;Section&lt;/h2&gt;, &lt;p&gt;Paragraph&lt;/p&gt;, &lt;ul&gt;&lt;li&gt;List item&lt;/li&gt;&lt;/ul&gt;
                    </p>
                  </div>

                  <Button 
                    onClick={() => handleSave(lang.code as Language)}
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save {lang.name} Content
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
