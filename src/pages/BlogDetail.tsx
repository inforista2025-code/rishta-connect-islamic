import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Calendar, ArrowLeft, User } from 'lucide-react';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet-async';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();

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

  const defaultImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop';

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
            {/* Back Button */}
            <Button asChild variant="ghost" className="mb-6">
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>

            {/* Title & Meta */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Rishta Matrimony Team</span>
                </div>
              </div>
            </header>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-primary prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* CTA Section */}
            <div className="mt-12 p-6 bg-primary/10 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Looking for Your Life Partner?</h3>
              <p className="text-muted-foreground mb-4">
                Register today and find your perfect match with Islamic values.
              </p>
              <Button asChild>
                <Link to="/register">Register Now</Link>
              </Button>
            </div>

            {/* Related Articles CTA */}
            <div className="mt-8 text-center">
              <Button asChild variant="outline">
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
