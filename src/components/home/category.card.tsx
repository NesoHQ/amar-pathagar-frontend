'use client';

import { useRouter } from 'next/navigation';
import { CardWrapper } from '@/components/ui/card.wrapper';
import { Category } from '@/types/category';

export interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/books/category/${category.slug}`);
  };

  return (
    <CardWrapper
      imageUrl={category.image}
      imageAlt={category.name}
      aspectRatio="2/3"
      overlay={true}
      overlayGradient="linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)"
      contentPosition="bottom"
      padding="0.75rem"
      onClick={handleClick}
      hover={true}
      borderWidth="1px"
    >
      <h3
        className="text-base md:text-lg font-bold mb-0.5 line-clamp-1"
        style={{ 
          color: '#FFFFFF',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}
      >
        {category.name}
      </h3>
      <p
        className="text-xs md:text-sm font-medium"
        style={{ 
          color: 'rgba(255, 255, 255, 0.95)',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}
      >
        {category.bookCount} books
      </p>
    </CardWrapper>
  );
}
