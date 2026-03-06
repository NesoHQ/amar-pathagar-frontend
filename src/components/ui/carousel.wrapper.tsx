'use client';

import { useCallback, useEffect, useState, ReactNode } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselWrapperProps {
  children: ReactNode;
  slidesToShow?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: string;
  showArrows?: boolean;
  showDots?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  className?: string;
}

export function CarouselWrapper({
  children,
  slidesToShow = { mobile: 1, tablet: 2, desktop: 3 },
  gap = '1rem',
  showArrows = true,
  showDots = false,
  autoplay = false,
  autoplayDelay = 5000,
  className = '',
}: CarouselWrapperProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Autoplay
  useEffect(() => {
    if (!autoplay || !emblaApi) return;

    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [emblaApi, autoplay, autoplayDelay]);

  const childrenArray = Array.isArray(children) ? children : [children];
  const slideCount = childrenArray.length;

  return (
    <div className={`relative ${className}`}>
      {/* Carousel Container */}
      <div className="overflow-hidden touch-pan-y" ref={emblaRef}>
        <div className="flex" style={{ gap }}>
          {childrenArray.map((child, index) => (
            <div
              key={index}
              className="min-w-0 shrink-0"
              style={{
                flex: `0 0 calc((100% - ${gap} * ${slidesToShow.mobile - 1}) / ${slidesToShow.mobile})`,
              }}
            >
              <style jsx>{`
                @media (min-width: 640px) {
                  div {
                    flex: 0 0 calc((100% - ${gap} * ${slidesToShow.tablet - 1}) / ${slidesToShow.tablet}) !important;
                  }
                }
                @media (min-width: 1024px) {
                  div {
                    flex: 0 0 calc((100% - ${gap} * ${slidesToShow.desktop - 1}) / ${slidesToShow.desktop}) !important;
                  }
                }
              `}</style>
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Hidden on Mobile */}
      {showArrows && slideCount > slidesToShow.mobile && (
        <>
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 shadow-lg items-center justify-center"
            style={{
              backgroundColor: 'var(--card)',
              border: '2px solid var(--border)',
              color: 'var(--foreground)',
            }}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 shadow-lg items-center justify-center"
            style={{
              backgroundColor: 'var(--card)',
              border: '2px solid var(--border)',
              color: 'var(--foreground)',
            }}
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && slideCount > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: slideCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className="transition-all duration-300 rounded-full touch-manipulation"
              style={{
                width: selectedIndex === index ? '24px' : '8px',
                height: '8px',
                backgroundColor:
                  selectedIndex === index ? 'var(--primary)' : 'var(--muted)',
                minWidth: selectedIndex === index ? '24px' : '8px',
                minHeight: '8px',
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
