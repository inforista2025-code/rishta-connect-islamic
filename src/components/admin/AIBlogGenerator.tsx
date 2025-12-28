import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, ArrowLeft, Copy } from 'lucide-react';

interface AIBlogGeneratorProps {
  onClose: () => void;
  onBlogGenerated: (data: { title: string; content: string; excerpt: string }) => void;
}

export function AIBlogGenerator({ onClose, onBlogGenerated }: AIBlogGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('English');
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    title: string;
    content: string;
    excerpt: string;
  } | null>(null);
  
  const { toast } = useToast();

  const generateBlog = async () => {
    if (!topic.trim()) {
      toast({ title: '❌ Please enter a topic', variant: 'destructive' });
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: `You are an expert Islamic matrimonial content writer. Write blog articles that are:
- Respectful and aligned with Islamic values
- Educational and helpful for Muslims seeking marriage
- Professional and trustworthy in tone
- SEO-friendly with proper headings (use HTML tags like <h2>, <h3>, <p>, <ul>, <li>, <strong>)
- Include practical advice and Quranic/Hadith references where appropriate
- Write in ${language} language
- Length: 800-1200 words`
            },
            {
              role: 'user',
              content: `Write a complete blog article about: "${topic}"

Return the response in this exact JSON format:
{
  "title": "Blog title here",
  "excerpt": "2-3 sentence summary for preview",
  "content": "Full HTML formatted blog content here"
}`
            }
          ],
        })
      });

      const data = await response.json();
      const responseText = data.choices?.[0]?.message?.content;
      
      if (responseText) {
        // Parse the JSON response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setGeneratedContent({
            title: parsed.title || '',
            content: parsed.content || '',
            excerpt: parsed.excerpt || '',
          });
          toast({ title: '✅ Blog generated successfully!' });
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        throw new Error('No content generated');
      }
    } catch (error: any) {
      toast({ 
        title: '❌ Generation failed', 
        description: error.message,
        variant: 'destructive' 
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleUseContent = () => {
    if (generatedContent) {
      onBlogGenerated(generatedContent);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Generate Blog with AI
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Blog Topic</CardTitle>
            <CardDescription>
              Enter your topic and AI will generate a complete Islamic matrimonial blog
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="topic">Topic *</Label>
              <Textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How to find a righteous spouse in Islam, The importance of family involvement in marriage..."
                rows={3}
              />
            </div>

            <div>
              <Label>Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Urdu">Urdu</SelectItem>
                  <SelectItem value="Arabic">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={generateBlog} 
              disabled={generating || !topic.trim()}
              className="w-full"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Blog
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Content Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Title</Label>
                  <p className="font-semibold text-lg">{generatedContent.title}</p>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Excerpt</Label>
                  <p className="text-sm">{generatedContent.excerpt}</p>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Content Preview</Label>
                  <div 
                    className="prose prose-sm max-h-48 overflow-y-auto border rounded-md p-3 bg-muted/50"
                    dangerouslySetInnerHTML={{ __html: generatedContent.content.substring(0, 500) + '...' }}
                  />
                </div>

                <Button onClick={handleUseContent} className="w-full">
                  Use This Content
                </Button>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Enter a topic and click Generate to create blog content</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
