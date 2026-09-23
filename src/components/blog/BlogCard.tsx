import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_date: string;
}

export function BlogCard({ title, slug, excerpt, featured_image, published_date }: BlogCardProps) {
  const formattedDate = format(new Date(published_date), 'dd MMM, yyyy');
  
  const defaultImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop';

  return (
    <Card className="group overflow-hidden rounded-2xl hover:shadow-xl hover:-translate-y-1.5 active:scale-[0.99] transition-all duration-300 ease-out h-full flex flex-col border border-border/70">
      <div className="aspect-video overflow-hidden relative">
        <img
          src={featured_image || defaultImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors duration-200">
          <Link to={`/blog/${slug}`}>{title}</Link>
        </h3>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {excerpt || 'Read this insightful article about Islamic marriage and finding your perfect life partner...'}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="outline" className="w-full rounded-xl border-primary/30 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
          <Link to={`/blog/${slug}`}>
            <span>Read More</span>
            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
