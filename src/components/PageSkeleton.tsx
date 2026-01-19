import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface PageSkeletonProps {
  type?: 'default' | 'blog' | 'cards' | 'content';
}

export function PageSkeleton({ type = 'default' }: PageSkeletonProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background animate-pulse">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header Skeleton */}
        <div className="py-12 px-4 text-center bg-gradient-to-b from-primary/5 to-background">
          <Skeleton className="h-10 w-64 md:w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-48 md:w-80 mx-auto" />
        </div>

        {/* Content Skeleton based on type */}
        <div className="container mx-auto px-4 py-12">
          {type === 'blog' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          )}

          {type === 'cards' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              ))}
            </div>
          )}

          {type === 'content' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <Skeleton className="h-10 w-48 mb-8" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-8 w-40 mt-8" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          )}

          {type === 'default' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border rounded-lg p-6 space-y-4">
                    <Skeleton className="h-8 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
