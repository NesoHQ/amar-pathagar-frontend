'use client';

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export interface CardWrapperProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  aspectRatio?: string; // e.g., '16/9', '3/2', '1/1'
  hover?: boolean;
  imageUrl?: string;
  imageAlt?: string;
  overlay?: boolean;
  overlayGradient?: string;
  contentPosition?: 'top' | 'center' | 'bottom';
  padding?: string;
  borderWidth?: string;
  useThemeOverlay?: boolean; // Use theme-aware overlay instead of custom gradient
}

export function CardWrapper({
  children,
  onClick,
  className = '',
  aspectRatio,
  hover = true,
  imageUrl,
  imageAlt = '',
  overlay = false,
  overlayGradient = 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
  contentPosition = 'bottom',
  padding = '1rem',
  borderWidth = '2px',
  useThemeOverlay = false,
}: CardWrapperProps) {
  const hoverClasses = hover
    ? 'hover:shadow-lg hover:-translate-y-1'
    : '';
  
  const cursorClass = onClick ? 'cursor-pointer' : '';

  const contentPositionClasses = {
    top: 'justify-start',
    center: 'justify-center',
    bottom: 'justify-end',
  };

  // Calculate padding-bottom percentage for aspect ratio
  const getPaddingBottom = () => {
    if (!aspectRatio) return undefined;
    
    const [width, height] = aspectRatio.split('/').map(Number);
    if (!width || !height) return undefined;
    
    return `${(height / width) * 100}%`;
  };

  const paddingBottom = getPaddingBottom();

  // Theme-aware overlay gradient
  const getThemeOverlay = () => {
    if (!useThemeOverlay) return overlayGradient;
    
    // Use CSS custom properties for theme-aware overlay
    return 'linear-gradient(to top, var(--card) 0%, transparent 100%)';
  };

  return (
    <Card
      className={`overflow-hidden group py-0 ${hoverClasses} ${cursorClass} ${className}`}
      onClick={onClick}
      style={{
        borderColor: 'var(--border)',
        borderWidth: borderWidth,
        borderStyle: 'solid',
        backgroundColor: 'var(--card)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <CardContent className="p-0">
        {imageUrl && aspectRatio ? (
          // Image Card with Aspect Ratio
          <div className="relative w-full" style={{ paddingBottom }}>
            <img
              src={imageUrl}
              alt={imageAlt}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            
            {overlay && (
              <div
                className="absolute inset-0"
                style={{ background: getThemeOverlay() }}
              />
            )}
            
            {/* Content Overlay */}
            <div
              className={`absolute inset-0 flex flex-col ${contentPositionClasses[contentPosition]}`}
              style={{ padding }}
            >
              {children}
            </div>
          </div>
        ) : imageUrl ? (
          // Image Card without Aspect Ratio
          <div className="relative">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            
            {overlay && (
              <div
                className="absolute inset-0"
                style={{ background: getThemeOverlay() }}
              />
            )}
            
            {/* Content Overlay */}
            <div
              className={`absolute inset-0 flex flex-col ${contentPositionClasses[contentPosition]}`}
              style={{ padding }}
            >
              {children}
            </div>
          </div>
        ) : (
          // Regular Card without Image
          <div style={{ padding }}>
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
