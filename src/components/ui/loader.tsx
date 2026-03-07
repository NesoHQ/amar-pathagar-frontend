'use client';

import { cn } from '@/lib/utils';
import { BookOpen } from 'lucide-react';

type LoaderSize = 'sm' | 'md' | 'lg';

interface LoaderProps {
  size?: LoaderSize;
  text?: string;
  className?: string;
}

const sizeMap: Record<LoaderSize, number> = {
  sm: 24,
  md: 48,
  lg: 72,
};

export function Loader({ size = 'md', text = 'Loading...', className }: LoaderProps) {
  const iconSize = sizeMap[size];

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className="animate-book-flip"
        style={{
          width: iconSize,
          height: iconSize,
        }}
      >
        <BookOpen
          style={{
            width: iconSize,
            height: iconSize,
            color: 'var(--foreground)',
          }}
        />
      </div>
      <p
        className="text-sm font-medium animate-pulse"
        style={{ color: 'var(--muted-foreground)' }}
      >
        {text}
      </p>
    </div>
  );
}
