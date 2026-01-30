'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'
import { booksAPI, bookmarksAPI } from '@/lib/api'

interface Book {
  id: string
  title: string
  author: string
  cover_url: string
  category: string
  status: string
  current_holder?: any
  total_reads: number
  average_rating: number
}

export default function BooksPage() {
  const router = useRouter()
  const { isAuthenticated, _hasHydrated } = useAuthStore()
  const { success, error } = useToastStore()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/login')
    } else if (isAuthenticated) {
      loadBooks()
    }
  }, [isAuthenticated, _hasHydrated, router])

  const loadBooks = async () => {
    try {
      const response = await booksAPI.getAll({ search, status: statusFilter })
      const booksData = response.data.data || response.data || []
      setBooks(Array.isArray(booksData) ? booksData : [])
    } catch (error) {
      console.error('Failed to load books:', error)
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    loadBooks()
  }

  const handleBookmark = async (bookId: string, type: string) => {
    try {
      await bookmarksAPI.create({ book_id: bookId, bookmark_type: type })
      success(`Book ${type}ed successfully!`)
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to bookmark book')
    }
  }

  if (!_hasHydrated || !isAuthenticated) {
    return null
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header - Compact */}
        <div className="border-4 border-old-ink bg-white p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl md:text-4xl">📚</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wider">Book Collection</h1>
              <p className="text-old-grey text-xs md:text-sm uppercase tracking-wider">
                {books.length} {books.length === 1 ? 'Book' : 'Books'} Available
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filters - Compact */}
        <div className="border-4 border-old-ink bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by title, author..."
                  className="flex-1 px-3 py-2 border-2 border-old-border focus:border-old-ink outline-none text-sm"
                />
                <button 
                  onClick={handleSearch} 
                  className="px-6 py-2 border-2 border-old-ink bg-old-ink text-old-paper font-bold uppercase text-xs
                           hover:bg-white hover:text-old-ink transition-all"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  loadBooks()
                }}
                className="w-full px-3 py-2 border-2 border-old-border focus:border-old-ink outline-none text-sm"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="reading">In Circulation</option>
                <option value="requested">Requested</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="text-center py-12 border-4 border-old-ink bg-white">
            <p className="text-old-grey uppercase tracking-wider text-sm">Loading books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12 border-4 border-old-ink bg-white">
            <p className="text-old-grey uppercase tracking-wider text-sm">No books found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onBookmark={handleBookmark} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

function BookCard({ book, onBookmark }: { book: Book; onBookmark: (id: string, type: string) => void }) {
  const router = useRouter()
  
  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-600',
      reading: 'bg-blue-600',
      requested: 'bg-orange-600',
    }
    return colors[status as keyof typeof colors] || colors.available
  }

  return (
    <div className="border-2 border-old-ink bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all group cursor-pointer"
         onClick={() => router.push(`/books/${book.id}`)}>
      {/* Book Cover - Smaller */}
      <div className="aspect-[3/4] bg-old-border flex items-center justify-center border-b-2 border-old-ink relative overflow-hidden">
        {book.cover_url ? (
          <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">📖</span>
        )}
        {/* Status Badge Overlay */}
        <div className={`absolute top-1.5 right-1.5 ${getStatusColor(book.status)} text-white px-1.5 py-0.5 text-xs font-bold uppercase shadow-md`}>
          {book.status === 'reading' ? 'Out' : book.status}
        </div>
      </div>

      {/* Book Info - Compact */}
      <div className="p-2.5">
        <h3 className="font-bold uppercase text-xs leading-tight mb-1 line-clamp-2 min-h-[2rem] group-hover:text-old-grey transition-colors">
          {book.title}
        </h3>
        
        <p className="text-old-grey text-xs mb-2 truncate">
          {book.author}
        </p>

        {/* Stats - Inline */}
        <div className="flex items-center justify-between text-xs text-old-grey mb-2 pb-2 border-b border-old-border">
          <span className="flex items-center gap-1">
            <span className="opacity-50">📖</span>
            {book.total_reads}
          </span>
          {book.average_rating > 0 && (
            <span className="flex items-center gap-1">
              <span className="text-yellow-600">★</span>
              {book.average_rating.toFixed(1)}
            </span>
          )}
          {book.category && (
            <span className="text-xs opacity-75 truncate max-w-[60px]" title={book.category}>
              {book.category}
            </span>
          )}
        </div>

        {/* Quick Actions - Compact */}
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onBookmark(book.id, 'like')
            }}
            className="flex-1 py-1 border border-old-border hover:border-red-400 hover:bg-red-50 transition-all text-sm"
            title="Like"
          >
            ❤️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onBookmark(book.id, 'bookmark')
            }}
            className="flex-1 py-1 border border-old-border hover:border-blue-400 hover:bg-blue-50 transition-all text-sm"
            title="Bookmark"
          >
            🔖
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onBookmark(book.id, 'priority')
            }}
            className="flex-1 py-1 border border-old-border hover:border-yellow-400 hover:bg-yellow-50 transition-all text-sm"
            title="Priority"
          >
            ⭐
          </button>
        </div>
      </div>
    </div>
  )
}
