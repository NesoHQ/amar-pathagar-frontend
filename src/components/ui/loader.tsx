'use client';

import { cn } from '@/lib/utils';
import { BookOpen } from 'lucide-react';

type LoaderSize = 'sm' | 'md' | 'lg';

interface LoaderProps {
  size?: LoaderSize;
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeMap: Record<LoaderSize, number> = {
  sm: 24,
  md: 48,
  lg: 72,
};

export function Loader({ 
  size = 'md', 
  text = 'Loading...', 
  className,
  fullScreen = false 
}: LoaderProps) {
  const iconSize = sizeMap[size];

  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className="animate-book-flip"
        style={{
          width: iconSize,
          height: iconSize,
          color: 'var(--foreground)',
        }}
      >
        <BookOpen
          style={{
            width: iconSize,
            height: iconSize,
          }}
        />
      </div>
      <p 
        className="text-sm font-medium animate-pulse"
        style={{
          color: 'var(--muted-foreground)',
        }}
      >
        {text}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
        }}
      >
        {content}
      </div>
    );
  }

  return content;
}
