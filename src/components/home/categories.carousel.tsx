'use client';

import { CarouselWrapper } from '@/components/ui/carousel.wrapper';
import { CategoryCard } from '@/components/home/category.card';
import { Category } from '@/types/category';

export interface CategoriesCarouselProps {
  categories: Category[];
}

export function CategoriesCarousel({ categories }: CategoriesCarouselProps) {
  return (
    <section
      className="py-8 md:py-12 border-b-4"
      style={{
        backgroundColor: 'var(--background)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6">
          <h2
            className="text-xl md:text-2xl font-bold uppercase tracking-wider mb-1"
            style={{ color: 'var(--foreground)' }}
          >
            Browse by Category
          </h2>
          <p
            className="text-xs md:text-sm"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Explore our diverse collection of books
          </p>
        </div>

        {/* Carousel */}
        <CarouselWrapper
          slidesToShow={{
            mobile: 3,
            tablet: 4,
            desktop: 6,
          }}
          gap="0.75rem"
          showArrows={true}
          showDots={false}
        >
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </CarouselWrapper>
      </div>
    </section>
  );
}
