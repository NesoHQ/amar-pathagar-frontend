'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Star } from 'lucide-react';
import { CardWrapper } from '@/components/ui/card.wrapper';
import { Book } from '@/types/book';

export interface BookCardProps {
  book: Book;
  onWishlistToggle?: (bookId: string) => void;
  isWishlisted?: boolean;
}

export function BookCard({ book, onWishlistToggle, isWishlisted = false }: BookCardProps) {
  const router = useRouter();
  const [wishlistState, setWishlistState] = useState(isWishlisted);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCardClick = () => {
    router.push(`/books/${book.id}`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    setWishlistState(!wishlistState);
    onWishlistToggle?.(book.id);
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const renderStars = () => {
    const fullStars = Math.floor(book.rating);
    const hasHalfStar = book.rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className="w-3 h-3"
            style={{
              fill: index < fullStars ? '#FFA500' : 'none',
              stroke: index < fullStars || (index === fullStars && hasHalfStar) ? '#FFA500' : '#9CA3AF',
              strokeWidth: 2,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <CardWrapper
      imageUrl={book.coverImage}
      imageAlt={book.title}
      aspectRatio="2/3"
      overlay={false}
      padding="0"
      onClick={handleCardClick}
      hover={true}
      borderWidth="1px"
      className="relative"
    >
      {/* Wishlist Button - Improved touch target */}
      <button
        onClick={handleWishlistClick}
        className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 ${
          isAnimating ? 'animate-scale-in' : ''
        }`}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(4px)',
          minWidth: '44px',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label={wishlistState ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className={`w-5 h-5 transition-all duration-200 ${
            wishlistState ? 'scale-110' : ''
          }`}
          style={{
            fill: wishlistState ? 'var(--destructive)' : 'none',
            stroke: wishlistState ? 'var(--destructive)' : 'var(--muted-foreground)',
            strokeWidth: 2,
          }}
        />
      </button>

      {/* Book Info Overlay at Bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 p-3"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 70%, transparent 100%)',
        }}
      >
        <h3
          className="text-sm font-bold mb-1 line-clamp-2 leading-tight"
          style={{
            color: '#FFFFFF',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {book.title}
        </h3>
        
        <p
          className="text-xs mb-1.5 line-clamp-1"
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {book.author}
        </p>

        <div className="flex items-center justify-between">
          {renderStars()}
          
          <span
            className="text-xs font-medium px-2 py-0.5 rounded"
            style={{
              backgroundColor: book.available ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
              color: '#FFFFFF',
            }}
          >
            {book.available ? 'Available' : 'Borrowed'}
          </span>
        </div>
      </div>
    </CardWrapper>
  );
}
