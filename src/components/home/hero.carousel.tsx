'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroCarouselProps } from '@/types/hero';
import { useAuthStore } from '@/store/authStore';

export function HeroCarousel({ slides, autoplay = false, autoplayDelay = 5000 }: HeroCarouselProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    duration: 25,
    dragFree: false,
    containScroll: 'trimSnaps',
    skipSnaps: false,
    align: 'start'
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        scrollPrev();
      } else if (e.key === 'ArrowRight') {
        scrollNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollPrev, scrollNext]);

  const handleCTAClick = (href: string) => {
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(href);
    }
  };

  return (
    <div className="relative w-full overflow-hidden" role="region" aria-label="Hero carousel" aria-roledescription="carousel">
      {/* Carousel Container */}
      <div className="overflow-hidden touch-pan-y" ref={emblaRef}>
        <div className="flex" role="list">
          {slides.map((slide, index) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative" role="listitem" aria-label={`Slide ${index + 1} of ${slides.length}`}>
              {/* Slide Content */}
              <div className="relative min-h-[550px] md:h-[70vh] md:min-h-[500px] md:max-h-[700px]">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    style={{
                      filter: 'brightness(0.4)',
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
                    }}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex items-center py-8 md:py-0">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                      {/* Left: Main Content */}
                      <div className="lg:col-span-7">
                        {/* Animated Content */}
                        <div
                          className="space-y-4 md:space-y-6 animate-fade-in"
                          style={{
                            animation: selectedIndex === index ? 'fadeInUp 0.8s ease-out' : 'none',
                          }}
                        >
                          {/* Subtitle */}
                          <div className="inline-block">
                            <span
                              className="text-xs md:text-sm font-bold uppercase tracking-wider px-3 md:px-4 py-1 md:py-2 rounded-full"
                              style={{
                                backgroundColor: 'var(--primary)',
                                color: 'var(--primary-foreground)',
                              }}
                            >
                              {slide.subtitle}
                            </span>
                          </div>

                          {/* Title */}
                          <h1
                            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight"
                            style={{ color: '#FFFFFF' }}
                          >
                            {slide.title}
                          </h1>

                          {/* Description */}
                          <p
                            className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed"
                            style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                          >
                            {slide.description}
                          </p>

                          {/* CTAs - Desktop Only */}
                          <div className="hidden md:flex flex-col sm:flex-row gap-2 md:gap-4 pt-2 md:pt-4">
                            <button
                              onClick={() => handleCTAClick(
                                isAuthenticated && slide.cta.primary.href === '/register' 
                                  ? '/dashboard' 
                                  : slide.cta.primary.href
                              )}
                              className="px-5 md:px-8 py-2.5 md:py-4 font-bold text-sm md:text-base lg:text-lg rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                              style={{
                                backgroundColor: 'var(--primary)',
                                color: 'var(--primary-foreground)',
                              }}
                            >
                              {isAuthenticated && slide.cta.primary.href === '/register'
                                ? 'Go to Dashboard'
                                : slide.cta.primary.text}
                            </button>

                            {slide.cta.secondary && (
                              <button
                                onClick={() => handleCTAClick(slide.cta.secondary!.href)}
                                className="px-5 md:px-8 py-2.5 md:py-4 font-bold text-sm md:text-base lg:text-lg rounded-lg transition-all duration-200 border-2 hover:bg-white/10 active:bg-white/5"
                                style={{
                                  borderColor: '#FFFFFF',
                                  color: '#FFFFFF',
                                  backgroundColor: 'transparent',
                                }}
                              >
                                {slide.cta.secondary.text}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Mobile Stats - Below Content */}
                        <div className="lg:hidden mt-8 space-y-4">
                          <div
                            className="rounded-xl p-4 backdrop-blur-md shadow-xl"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            {/* Stats Grid - 2x2 on mobile */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              {slide.stats.map((stat, idx) => (
                                <div
                                  key={idx}
                                  className="text-center p-3 rounded-lg"
                                  style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  }}
                                >
                                  <div className="text-2xl mb-1.5">{stat.icon}</div>
                                  <div className="text-lg font-bold mb-1" style={{ color: '#FFFFFF' }}>
                                    {stat.value}
                                  </div>
                                  <div className="text-xs leading-tight" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                    {stat.label}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Trust Indicators - Compact on mobile */}
                            <div className="space-y-2 pt-3 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                              {slide.trustIndicators.map((indicator, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <div
                                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                    style={{
                                      backgroundColor: 'var(--primary)',
                                      color: 'var(--primary-foreground)',
                                    }}
                                  >
                                    {indicator.icon}
                                  </div>
                                  <span className="text-xs font-medium leading-tight" style={{ color: '#FFFFFF' }}>
                                    {indicator.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* CTAs - Mobile Only (Below Stats) */}
                          <div className="flex flex-col gap-3">
                            <button
                              onClick={() => handleCTAClick(
                                isAuthenticated && slide.cta.primary.href === '/register' 
                                  ? '/dashboard' 
                                  : slide.cta.primary.href
                              )}
                              className="px-6 py-3 font-bold text-sm rounded-lg transition-all duration-200 shadow-lg active:translate-y-0"
                              style={{
                                backgroundColor: 'var(--primary)',
                                color: 'var(--primary-foreground)',
                              }}
                            >
                              {isAuthenticated && slide.cta.primary.href === '/register'
                                ? 'Go to Dashboard'
                                : slide.cta.primary.text}
                            </button>

                            {slide.cta.secondary && (
                              <button
                                onClick={() => handleCTAClick(slide.cta.secondary!.href)}
                                className="px-6 py-3 font-bold text-sm rounded-lg transition-all duration-200 border-2 active:bg-white/5"
                                style={{
                                  borderColor: '#FFFFFF',
                                  color: '#FFFFFF',
                                  backgroundColor: 'transparent',
                                }}
                              >
                                {slide.cta.secondary.text}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Stats Card (Desktop Only) */}
                      <div className="hidden lg:block lg:col-span-5">
                        <div
                          className="rounded-2xl p-6 backdrop-blur-md shadow-2xl animate-fade-in"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            animation: selectedIndex === index ? 'fadeIn 1s ease-out 0.3s both' : 'none',
                          }}
                        >
                          {/* Stats Grid - Slide Specific */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            {slide.stats.map((stat, idx) => (
                              <div
                                key={idx}
                                className="text-center p-4 rounded-xl transition-all duration-200 hover:scale-105"
                                style={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                }}
                              >
                                <div className="text-3xl mb-2">{stat.icon}</div>
                                <div className="text-2xl font-bold mb-1" style={{ color: '#FFFFFF' }}>
                                  {stat.value}
                                </div>
                                <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                  {stat.label}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Trust Indicators - Slide Specific */}
                          <div className="space-y-3 pt-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                            {slide.trustIndicators.map((indicator, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                                  style={{
                                    backgroundColor: 'var(--primary)',
                                    color: 'var(--primary-foreground)',
                                  }}
                                >
                                  {indicator.icon}
                                </div>
                                <span className="text-sm font-medium" style={{ color: '#FFFFFF' }}>
                                  {indicator.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Hidden on Mobile */}
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 items-center justify-center"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          color: '#FFFFFF',
        }}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 items-center justify-center"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          color: '#FFFFFF',
        }}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 md:gap-2" role="tablist" aria-label="Slide navigation">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className="transition-all duration-300 rounded-full touch-manipulation"
            style={{
              width: selectedIndex === index ? '24px' : '8px',
              height: '8px',
              backgroundColor: selectedIndex === index ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)',
              minWidth: selectedIndex === index ? '24px' : '8px',
              minHeight: '8px'
            }}
            role="tab"
            aria-selected={selectedIndex === index}
            aria-label={`Go to slide ${index + 1}`}
            aria-controls={`slide-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
