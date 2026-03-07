'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { BooksFilters } from '@/components/books/books.filters';
import { BookCardSkeletonGrid } from '@/components/books/book.card.skeleton';
import { PageHeader } from '@/components/common/page.header';
import { useInfiniteScroll } from '@/hooks/use.infinite.scroll';
import { syncFiltersToUrl } from '@/utils/url.params';
import { MOCK_BOOKS_LIST, filterBooks, paginateBooks, type BookListItem } from '@/constants/books.list';
import { MOCK_CATEGORIES } from '@/constants/categories';

interface Book extends BookListItem {}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export default function CategoryBooksPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { _hasHydrated } = useAuthStore();
  const { error } = useToastStore();

  const categorySlug = params.slug as string;
  
  // Find category info
  const category = MOCK_CATEGORIES.find(cat => cat.slug === categorySlug);
  const categoryName = category?.name || categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // State
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  
  // Filters from URL (category is pre-set from route)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: categorySlug,
    status: searchParams.get('status') || '',
    sort: searchParams.get('sort') || 'relevance',
  });

  // Infinite scroll hook
  const { observerTarget } = useInfiniteScroll({
    onLoadMore: loadMoreBooks,
    hasMore: pagination?.hasNextPage || false,
    isLoading: loadingMore,
    threshold: 300,
  });

  // Get filtered books (using mock data for now)
  const filteredBooks = useMemo(() => {
    return filterBooks(MOCK_BOOKS_LIST, {
      search: filters.search,
      category: filters.category,
      status: filters.status,
      sort: filters.sort,
    });
  }, [filters]);

  // Load books with pagination
  const loadBooks = useCallback((page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // No delay for mock data - instant load
      const result = paginateBooks(filteredBooks, page, 18);
      
      if (append) {
        setBooks((prev) => [...prev, ...result.data]);
      } else {
        setBooks(result.data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      setPagination(result.pagination);
      setLoading(false);
      setLoadingMore(false);
    } catch (err) {
      console.error('Failed to load books:', err);
      error('Failed to load books');
      setBooks([]);
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filteredBooks, error]);

  // Load more books for infinite scroll
  function loadMoreBooks() {
    if (pagination?.hasNextPage && !loadingMore) {
      loadBooks(pagination.nextPage!, true);
    }
  }

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    // Don't allow changing category from filters
    if (key === 'category') return;
    
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    syncFiltersToUrl(newFilters, router, `/books/category/${categorySlug}`);
  };

  // Clear all filters (except category)
  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      category: categorySlug,
      status: '',
      sort: 'relevance',
    };
    setFilters(clearedFilters);
    syncFiltersToUrl(clearedFilters, router, `/books/category/${categorySlug}`);
  };

  // Load books when filters change
  useEffect(() => {
    if (_hasHydrated) {
      loadBooks(1, false);
    }
  }, [filters, _hasHydrated, loadBooks]);

  if (!_hasHydrated) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8 pt-6 md:pt-8">
        {/* Page Header with Breadcrumbs */}
        <PageHeader
          title={categoryName}
          description={pagination ? `${pagination.total} books in this category` : 'Loading...'}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Books', href: '/books' },
            { label: categoryName },
          ]}
        />

        {/* Main Content */}
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <BooksFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              totalBooks={pagination?.total || 0}
              hideCategory={true}
            />
          </aside>

          {/* Books Grid */}
          <main>
            {loading ? (
              <BookCardSkeletonGrid count={18} />
            ) : books.length === 0 ? (
              <div className="text-center py-12 md:py-24 px-4">
                {/* Empty State Icon */}
                <div className="flex justify-center mb-4 md:mb-6">
                  <svg
                    className="w-16 h-16 md:w-24 md:h-24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    <path
                      d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                
                <p className="text-lg md:text-2xl font-bold mb-1 md:mb-2" style={{ color: 'var(--foreground)' }}>
                  No Books Found
                </p>
                <p className="text-xs md:text-sm mb-6 md:mb-8" style={{ color: 'var(--muted-foreground)' }}>
                  Try adjusting your filters or browse all books
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                  <button
                    onClick={handleClearFilters}
                    className="px-4 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-medium rounded-lg transition-all hover:opacity-90"
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                    }}
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => router.push('/books')}
                    className="px-4 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-medium rounded-lg transition-all hover:opacity-90"
                    style={{
                      backgroundColor: 'var(--muted)',
                      color: 'var(--foreground)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    Browse All Books
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>

                {/* Infinite Scroll Trigger */}
                <div ref={observerTarget} className="h-24 md:h-32 flex items-center justify-center mt-8 md:mt-12">
                  {loadingMore && (
                    <div className="flex flex-col items-center gap-2 md:gap-3">
                      <div className="animate-spin text-3xl md:text-4xl">📖</div>
                      <p className="text-xs md:text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                        Loading more books...
                      </p>
                    </div>
                  )}
                  {!pagination?.hasNextPage && books.length > 0 && (
                    <div className="text-center">
                      <p className="text-xs md:text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
                        ✓ You've reached the end
                      </p>
                      <p className="text-[10px] md:text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {pagination?.total || 0} books total
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'rgba(34, 197, 94, 0.9)',
      reading: 'rgba(59, 130, 246, 0.9)',
      requested: 'rgba(249, 115, 22, 0.9)',
      on_hold: 'rgba(234, 179, 8, 0.9)',
    };
    return colors[status as keyof typeof colors] || colors.available;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      available: 'Available',
      reading: 'Out',
      requested: 'Requested',
      on_hold: 'On Hold',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const renderStars = () => {
    const fullStars = Math.floor(book.average_rating);
    const hasHalfStar = book.average_rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className="text-[10px] md:text-xs"
            style={{
              color: index < fullStars || (index === fullStars && hasHalfStar) ? '#fbbf24' : '#d1d5db',
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={() => router.push(`/books/${book.id}`)}
    >
      {/* Book Cover */}
      <div className="relative aspect-2/3 overflow-hidden rounded-lg md:rounded-xl mb-2 md:mb-3 shadow-md md:shadow-lg transition-all duration-300 group-hover:shadow-xl md:group-hover:shadow-2xl group-hover:scale-[1.02]">
        {book.cover_url ? (
          <img 
            src={book.cover_url} 
            alt={book.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--muted)' }}
          >
            <span className="text-4xl md:text-6xl">📖</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div
          className="absolute top-2 right-2 md:top-3 md:right-3 px-1.5 md:px-2 py-0.5 text-[9px] md:text-[10px] font-bold uppercase rounded-md shadow-lg backdrop-blur-sm"
          style={{
            backgroundColor: getStatusColor(book.status),
            color: '#ffffff',
          }}
        >
          {getStatusLabel(book.status)}
        </div>

        {/* Info Overlay - Always Visible */}
        <div
          className="absolute bottom-0 left-0 right-0 p-2 md:p-3 transition-all duration-300"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 60%, transparent 100%)',
          }}
        >
          <h3
            className="text-xs md:text-sm font-bold mb-0.5 md:mb-1 line-clamp-2 leading-tight"
            style={{
              color: '#FFFFFF',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            }}
          >
            {book.title}
          </h3>
          
          <p
            className="text-[10px] md:text-xs mb-1 md:mb-2 line-clamp-1"
            style={{
              color: 'rgba(255, 255, 255, 0.85)',
              textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            }}
          >
            {book.author}
          </p>

          <div className="flex items-center justify-between">
            {book.average_rating > 0 ? (
              <div className="flex items-center gap-0.5 md:gap-1">
                {renderStars()}
                <span className="text-[10px] md:text-xs font-bold ml-0.5 md:ml-1" style={{ color: '#fbbf24' }}>
                  {book.average_rating.toFixed(1)}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-[10px] md:text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>No ratings</span>
              </div>
            )}
            
            <span className="flex items-center gap-0.5 md:gap-1 text-[10px] md:text-xs font-medium" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              <span>📖</span>
              {book.total_reads}
            </span>
          </div>
        </div>
      </div>

      {/* Category Badge Below Card */}
      {book.category && (
        <div className="px-0.5 md:px-1">
          <span 
            className="inline-block text-[10px] md:text-xs font-medium px-1.5 md:px-2 py-0.5 md:py-1 rounded-md"
            style={{ 
              backgroundColor: 'var(--muted)',
              color: 'var(--muted-foreground)',
            }}
          >
            {book.category}
          </span>
        </div>
      )}
    </div>
  );
}
