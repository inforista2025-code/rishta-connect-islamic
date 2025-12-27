import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BlogCard } from '@/components/blog/BlogCard';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, BookOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Blog() {
  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ['blogs-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('published_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <Helmet>
        <title>Blog - Rishta Matrimony | Islamic Marriage Guidance</title>
        <meta name="description" content="Read our latest articles about Islamic marriage, finding the right life partner, and building a blessed Muslim family. Expert guidance for your matrimony journey." />
        <meta name="keywords" content="Islamic marriage, Muslim matrimony, nikah guidance, halal relationship, Muslim wedding" />
        <link rel="canonical" href="/blog" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-gradient-to-b from-primary/10 to-background py-16">
            <div className="container mx-auto px-4 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Our Blog
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Insights, guidance, and wisdom for your journey to finding a blessed life partner
              </p>
              <p className="text-sm text-muted-foreground mt-2 font-urdu">
                شادی کے سفر میں رہنمائی اور حکمت
              </p>
            </div>
          </section>

          {/* Blog Grid */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading articles...</span>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-destructive">Failed to load articles. Please try again.</p>
                </div>
              ) : blogs && blogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogs.map((blog) => (
                    <BlogCard
                      key={blog.id}
                      id={blog.id}
                      title={blog.title}
                      slug={blog.slug}
                      excerpt={blog.excerpt}
                      featured_image={blog.featured_image}
                      published_date={blog.published_date}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Articles Yet</h3>
                  <p className="text-muted-foreground">
                    We're working on bringing you valuable content. Check back soon!
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
