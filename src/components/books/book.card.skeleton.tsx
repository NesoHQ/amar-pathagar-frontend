import { Skeleton } from '@/components/ui/skeleton';

export function BookCardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Cover skeleton with rounded corners and gradient overlay simulation */}
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden mb-3 shadow-lg" style={{ backgroundColor: 'var(--muted)' }}>
        <Skeleton className="w-full h-full" />
        
        {/* Status badge skeleton */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-16 rounded-md" />
        </div>
        
        {/* Info overlay skeleton at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
          {/* Title lines */}
          <Skeleton className="h-3 w-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
          <Skeleton className="h-3 w-3/4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
          
          {/* Author */}
          <Skeleton className="h-2.5 w-1/2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
          
          {/* Rating and reads */}
          <div className="flex items-center justify-between pt-1">
            <Skeleton className="h-2.5 w-16" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
            <Skeleton className="h-2.5 w-10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
          </div>
        </div>
      </div>
      
      {/* Category badge skeleton */}
      <div className="px-1">
        <Skeleton className="h-5 w-20 rounded-md" />
      </div>
    </div>
  );
}

export function BookCardSkeletonGrid({ count = 18 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <BookCardSkeleton key={index} />
      ))}
    </div>
  );
}
