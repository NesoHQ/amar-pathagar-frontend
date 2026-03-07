'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CarouselWrapper } from '@/components/ui/carousel.wrapper';
import { BookCard } from '@/components/home/book.card';
import { Book } from '@/types/book';
import { useInView } from '@/hooks/useInView';

export interface BooksSectionProps {
  title: string;
  books: Book[];
  categorySlug?: string;
  onWishlistToggle?: (bookId: string) => void;
  wishlistedBooks?: string[];
}

export function BooksSection({
  title,
  books,
  categorySlug,
  onWishlistToggle,
  wishlistedBooks = [],
}: BooksSectionProps) {
  const router = useRouter();
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const handleViewAll = () => {
    if (categorySlug) {
      router.push(`/books/category/${categorySlug}`);
    } else {
      router.push('/books');
    }
  };

  if (books.length === 0) {
    return null;
  }

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-3 fade-in-view ${isInView ? 'in-view' : ''}`}
      style={{
        backgroundColor: 'var(--background)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <h2
              className="text-xs md:text-sm font-bold uppercase tracking-wider"
              style={{ color: 'var(--foreground)' }}
            >
              {title}
            </h2>
            <p
              className="text-[10px] md:text-xs mt-0.5"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {books.length} books
            </p>
          </div>

          {/* View All Button */}
          <Button
            onClick={handleViewAll}
            size="xs"
            variant="default"
            className="uppercase group"
          >
            <span>View All</span>
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>

        {/* Books Carousel */}
        <CarouselWrapper
          slidesToShow={{
            mobile: 2,
            tablet: 3,
            desktop: 6,
          }}
          gap="0.375rem"
          showArrows={true}
          showDots={false}
        >
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onWishlistToggle={onWishlistToggle}
              isWishlisted={wishlistedBooks.includes(book.id)}
            />
          ))}
        </CarouselWrapper>
      </div>

      {/* Elegant Divider with Decorative Element */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 md:mt-2.5">
        <div className="flex items-center gap-2">
          <div
            className="flex-1 h-px transition-opacity duration-500"
            style={{
              background: `linear-gradient(to right, transparent, var(--border), transparent)`,
              opacity: isInView ? 0.3 : 0,
            }}
          />
          <div className="flex items-center gap-1">
            <div
              className="w-1 h-1 rounded-full transition-all duration-500"
              style={{
                backgroundColor: 'var(--muted-foreground)',
                opacity: isInView ? 0.4 : 0,
                transform: isInView ? 'scale(1)' : 'scale(0)',
              }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full transition-all duration-500 delay-75"
              style={{
                backgroundColor: 'var(--muted-foreground)',
                opacity: isInView ? 0.5 : 0,
                transform: isInView ? 'scale(1)' : 'scale(0)',
              }}
            />
            <div
              className="w-1 h-1 rounded-full transition-all duration-500 delay-150"
              style={{
                backgroundColor: 'var(--muted-foreground)',
                opacity: isInView ? 0.4 : 0,
                transform: isInView ? 'scale(1)' : 'scale(0)',
              }}
            />
          </div>
          <div
            className="flex-1 h-px transition-opacity duration-500"
            style={{
              background: `linear-gradient(to left, transparent, var(--border), transparent)`,
              opacity: isInView ? 0.3 : 0,
            }}
          />
        </div>
      </div>
    </section>
  );
}
