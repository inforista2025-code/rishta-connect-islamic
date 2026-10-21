import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Calendar, ArrowLeft, User, Share2, Copy, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet-async';
import { LanguageSwitch, Language } from '@/components/blog/LanguageSwitch';
import { BlogShareButton } from '@/components/blog/BlogShareButton';
import { useToast } from '@/hooks/use-toast';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [translatedContent, setTranslatedContent] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const translateContent = useCallback(async (lang: Language) => {
    if (!blog || lang === 'en') {
      setTranslatedContent(null);
      return;
    }

    setIsTranslating(true);
    try {
      const response = await supabase.functions.invoke('translate-blog', {
        body: {
          title: blog.title,
          content: blog.content,
          targetLanguage: lang
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Translation failed');
      }

      const data = response.data;
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.title && data.content) {
        setTranslatedContent({
          title: data.title,
          content: data.content,
        });
        toast({
          title: '✅ Translation complete',
          description: `Content translated successfully`,
        });
      }
    } catch (error: any) {
      console.error('Translation error:', error);
      toast({
        title: '❌ Translation failed',
        description: error.message || 'Using original content',
        variant: 'destructive'
      });
      setTranslatedContent(null);
    } finally {
      setIsTranslating(false);
    }
  }, [blog, toast]);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    translateContent(lang);
  };

  const defaultImage = 'https://rishtamatrimony.vercel.app/og-image.jpg';

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = format(new Date(blog.published_date), 'dd MMMM, yyyy');
  const displayTitle = translatedContent?.title || blog.title;
  const displayContent = translatedContent?.content || blog.content;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://rishtamatrimony.vercel.app/blog/${blog.slug}`;

  const handleDirectCopy = () => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(currentUrl);
      } else {
        const input = document.createElement('input');
        input.value = currentUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      toast({
        title: '✅ Link Copied!',
        description: 'Article link copied to clipboard. Share it with friends and family!',
      });
    } catch {
      toast({
        title: '❌ Copy failed',
        description: 'Please copy link directly from browser address bar.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{blog.seo_meta_title || blog.title} - Rishta Matrimony Blog</title>
        <meta name="description" content={blog.seo_meta_description || blog.excerpt || `Read about ${blog.title} on Rishta Matrimony Blog`} />
        <link rel="canonical" href={`/blog/${blog.slug}`} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt || ''} />
        <meta property="og:image" content={blog.featured_image || defaultImage} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-grow">
          {/* Featured Image */}
          <div className="w-full h-64 md:h-96 overflow-hidden">
            <img
              src={blog.featured_image || defaultImage}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = defaultImage;
              }}
            />
          </div>

          {/* Article Content */}
          <article className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Back Button & Language Switch */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <Button asChild variant="ghost">
                <Link to="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
              
              <LanguageSwitch 
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
                isTranslating={isTranslating}
              />
            </div>

            {/* Title & Meta */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                {isTranslating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Translating...
                  </span>
                ) : displayTitle}
              </h1>
              <div className="flex flex-wrap items-center justify-between gap-4 text-muted-foreground pt-3 border-t border-border/60">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span>Rishta Matrimony Team</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BlogShareButton blogSlug={blog.slug} blogTitle={displayTitle} />
                </div>
              </div>
            </header>

            {/* Content */}
            {isTranslating ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
                <span>Translating content...</span>
              </div>
            ) : (
              <div 
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-primary prose-strong:text-foreground"
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />
            )}

            {/* Share Article Section */}
            <div className="mt-10 p-5 sm:p-6 bg-gradient-to-r from-primary/5 via-muted/40 to-primary/5 border border-primary/20 rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-primary" />
                    Share this Islamic Guidance
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Spread knowledge and benefit family and friends looking for halal nikah guidance.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {/* WhatsApp Quick Share Button */}
                  <Button
                    asChild
                    size="sm"
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium rounded-xl shadow-sm"
                  >
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Read this article on Rishta Matrimony: "${displayTitle}"\n\n${currentUrl}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                  </Button>

                  {/* Copy Link Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDirectCopy}
                    className="rounded-xl border-border/80 hover:border-primary/50 flex items-center gap-1.5"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </Button>

                  {/* Full Share Dropdown */}
                  <BlogShareButton blogSlug={blog.slug} blogTitle={displayTitle} />
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-8 p-6 bg-primary/10 rounded-2xl text-center border border-primary/20">
              <h3 className="text-xl font-semibold mb-2">Looking for Your Life Partner?</h3>
              <p className="text-muted-foreground mb-4">
                Register today and find your perfect match with Islamic values.
              </p>
              <Button asChild className="rounded-xl">
                <Link to="/register">Register Free Now</Link>
              </Button>
            </div>

            {/* Related Articles CTA */}
            <div className="mt-8 text-center">
              <Button asChild variant="outline" className="rounded-xl">
                <Link to="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Read More Articles
                </Link>
              </Button>
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}
