'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function BookDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8 pt-6 md:pt-8">
      <div className="space-y-6">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Book Card Skeleton */}
        <div className="border-4 rounded-lg p-6 md:p-8" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Cover Skeleton */}
            <div className="md:col-span-3">
              <Skeleton className="aspect-[3/4] w-full rounded-lg" />
            </div>

            {/* Info Skeleton */}
            <div className="md:col-span-9 space-y-4">
              <div>
                <Skeleton className="h-10 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>

              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Reviews Skeleton */}
        <div className="border-4 rounded-lg" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <Skeleton className="h-16 rounded-t-lg" />
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
