"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { Logo } from "@/components/common/logo";
import { BackToTop } from "@/components/common/back.to.top";
import { Footer } from "@/components/layout/footer";
import { HeroCarousel } from "@/components/home/hero.carousel";
import { CategoriesCarousel } from "@/components/home/categories.carousel";
import { BooksSection } from "@/components/home/books.section";
import { HERO_SLIDES } from "@/constants/hero";
import { MOCK_CATEGORIES } from "@/constants/categories";
import { getBooksByCategory } from "@/constants/books";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleWishlistToggle = (bookId: string) => {
    // TODO: Implement wishlist toggle logic
    console.log('Toggle wishlist for book:', bookId);
  };

  if (!mounted) {
    return null;
  }

  // Get books for featured categories
  const topLovingBooks = getBooksByCategory('top-loving', 12);
  const engineeringBooks = getBooksByCategory('engineering', 12);
  const sciFiBooks = getBooksByCategory('sci-fi', 12);
  const literatureBooks = getBooksByCategory('literature', 12);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Hero Carousel Section */}
      <HeroCarousel slides={HERO_SLIDES} autoplay={false} autoplayDelay={5000} />

      {/* Categories Carousel Section */}
      <CategoriesCarousel categories={MOCK_CATEGORIES} />

      {/* Book Sections */}
      <BooksSection
        title="Top Loving"
        books={topLovingBooks}
        categorySlug="top-loving"
        onWishlistToggle={handleWishlistToggle}
      />

      <BooksSection
        title="Engineering"
        books={engineeringBooks}
        categorySlug="engineering"
        onWishlistToggle={handleWishlistToggle}
      />

      <BooksSection
        title="Science Fiction"
        books={sciFiBooks}
        categorySlug="sci-fi"
        onWishlistToggle={handleWishlistToggle}
      />

      <BooksSection
        title="Literature"
        books={literatureBooks}
        categorySlug="literature"
        onWishlistToggle={handleWishlistToggle}
      />

      {/* Back to Top Button */}
      <BackToTop />

      {/* Footer */}
      <Footer />
    </div>
  );
}
