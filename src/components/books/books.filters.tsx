'use client';

import { X, SlidersHorizontal, Search } from 'lucide-react';
import { MOCK_CATEGORIES } from '@/constants/categories';
import { useState } from 'react';

interface BooksFiltersProps {
  filters: {
    search: string;
    category: string;
    status: string;
    sort: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  totalBooks: number;
  hideCategory?: boolean;
}

export function BooksFilters({
  filters,
  onFilterChange,
  onClearFilters,
  totalBooks,
  hideCategory = false,
}: BooksFiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (hideCategory && key === 'category') return false;
    return value && value !== 'relevance' && value !== '';
  }).length;

  const handleClearFilters = () => {
    onClearFilters();
    setShowMobileFilters(false);
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4 md:mb-6">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 rounded-lg font-medium text-xs md:text-sm transition-all"
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            color: 'var(--foreground)',
          }}
        >
          <span className="flex items-center gap-1.5 md:gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs rounded-full font-bold" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                {activeFiltersCount}
              </span>
            )}
          </span>
          <span className="text-[10px] md:text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {totalBooks} books
          </span>
        </button>
      </div>

      {/* Filters Container */}
      <div
        className={`
          ${showMobileFilters ? 'block' : 'hidden'} lg:block
          rounded-lg p-4 md:p-6 space-y-4 md:space-y-6
        `}
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 md:pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 className="font-bold text-base md:text-lg flex items-center gap-1.5 md:gap-2" style={{ color: 'var(--foreground)' }}>
            <SlidersHorizontal className="w-4 h-4 md:w-5 md:h-5" />
            Filters
          </h3>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="text-[10px] md:text-xs font-medium hover:underline flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 rounded transition-all"
              style={{ color: 'var(--muted-foreground)', backgroundColor: 'var(--muted)' }}
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>

        {/* Search */}
        <div>
          <label className="block text-xs md:text-sm font-medium mb-1.5 md:mb-2" style={{ color: 'var(--foreground)' }}>
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Title, author..."
              className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm transition-all focus:outline-none focus:ring-2"
              style={{ 
                border: '1px solid var(--border)', 
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
              }}
            />
            <Search className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4" style={{ color: 'var(--muted-foreground)' }} />
          </div>
        </div>

        {/* Category */}
        {!hideCategory && (
          <div>
            <label className="block text-xs md:text-sm font-medium mb-1.5 md:mb-2" style={{ color: 'var(--foreground)' }}>
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all focus:outline-none focus:ring-2"
              style={{ 
                border: '1px solid var(--border)', 
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
              }}
            >
              <option value="">All Categories</option>
              {MOCK_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status */}
        <div>
          <label className="block text-xs md:text-sm font-medium mb-1.5 md:mb-2" style={{ color: 'var(--foreground)' }}>
            Availability
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all focus:outline-none focus:ring-2"
            style={{ 
              border: '1px solid var(--border)', 
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
            }}
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="reading">In Circulation</option>
            <option value="requested">Requested</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs md:text-sm font-medium mb-1.5 md:mb-2" style={{ color: 'var(--foreground)' }}>
            Sort By
          </label>
          <select
            value={filters.sort}
            onChange={(e) => onFilterChange('sort', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all focus:outline-none focus:ring-2"
            style={{ 
              border: '1px solid var(--border)', 
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
            }}
          >
            <option value="relevance">Relevance</option>
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
            <option value="rating_desc">Rating (High to Low)</option>
            <option value="rating_asc">Rating (Low to High)</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="pt-3 md:pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-[10px] md:text-xs font-medium mb-2 md:mb-3" style={{ color: 'var(--muted-foreground)' }}>
              Active Filters ({activeFiltersCount})
            </p>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {filters.search && (
                <FilterTag
                  label={`"${filters.search}"`}
                  onRemove={() => onFilterChange('search', '')}
                />
              )}
              {!hideCategory && filters.category && (
                <FilterTag
                  label={MOCK_CATEGORIES.find(c => c.slug === filters.category)?.name || filters.category}
                  onRemove={() => onFilterChange('category', '')}
                />
              )}
              {filters.status && (
                <FilterTag
                  label={filters.status}
                  onRemove={() => onFilterChange('status', '')}
                />
              )}
              {filters.sort && filters.sort !== 'relevance' && (
                <FilterTag
                  label={filters.sort.replace('_', ' ')}
                  onRemove={() => onFilterChange('sort', 'relevance')}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className="inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-medium transition-all hover:opacity-80"
      style={{ 
        border: '1px solid var(--border)', 
        backgroundColor: 'var(--muted)',
        color: 'var(--foreground)',
      }}
    >
      {label}
      <X className="w-2.5 h-2.5 md:w-3 md:h-3" />
    </button>
  );
}
