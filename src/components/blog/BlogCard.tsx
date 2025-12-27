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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="aspect-video overflow-hidden">
        <img
          src={featured_image || defaultImage}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
        <h3 className="text-xl font-semibold line-clamp-2 hover:text-primary transition-colors">
          <Link to={`/blog/${slug}`}>{title}</Link>
        </h3>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">
          {excerpt || 'Read this insightful article about Islamic marriage and finding your perfect life partner...'}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full group">
          <Link to={`/blog/${slug}`}>
            Read More
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
