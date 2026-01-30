'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'
import { booksAPI } from '@/lib/api'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, _hasHydrated } = useAuthStore()
  const { success, error } = useToastStore()
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    booksReading: 0,
  })
  const [myRequests, setMyRequests] = useState<any[]>([])

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, _hasHydrated, router])

  useEffect(() => {
    if (isAuthenticated) {
      loadStats()
      loadMyRequests()
    }
  }, [isAuthenticated])

  const loadStats = async () => {
    try {
      const response = await booksAPI.getAll()
      const books = response.data.data || []
      setStats({
        totalBooks: books.length,
        availableBooks: books.filter((b: any) => b.status === 'available').length,
        booksReading: books.filter((b: any) => b.status === 'reading').length,
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const loadMyRequests = async () => {
    try {
      const response = await booksAPI.getMyRequests()
      const requestsData = response.data.data || response.data || []
      setMyRequests(Array.isArray(requestsData) ? requestsData : [])
    } catch (error) {
      console.error('Failed to load requests:', error)
      setMyRequests([])
    }
  }

  const handleCancelRequest = async (bookId: string, bookTitle: string) => {
    try {
      await booksAPI.cancelRequest(bookId)
      success(`Request for "${bookTitle}" cancelled successfully!`)
      loadMyRequests()
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to cancel request')
    }
  }

  if (!_hasHydrated || !isAuthenticated || !user) {
    return null
  }

  const getScoreStatus = (score: number) => {
    if (score >= 100) return { label: 'Excellent Standing', color: 'text-green-700' }
    if (score >= 50) return { label: 'Good Standing', color: 'text-blue-700' }
    if (score >= 20) return { label: 'Fair Standing', color: 'text-yellow-700' }
    return { label: 'Low Priority', color: 'text-red-700' }
  }

  const scoreStatus = getScoreStatus(user.success_score)

  return (
    <Layout>
      <div className="space-y-6 md:space-y-8">
        {/* Compact Header with Score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Welcome Card */}
          <div className="lg:col-span-2 border-4 border-old-ink bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-4">
              <div className="text-5xl">👤</div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wider mb-1">
                  {user.full_name || user.username}
                </h1>
                <p className="text-sm text-old-grey uppercase tracking-wider">
                  Member Since {new Date(user.created_at || Date.now()).getFullYear()}
                </p>
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📖</span>
                    <div>
                      <p className="text-lg font-bold">{user.books_received}</p>
                      <p className="text-xs text-old-grey uppercase">Read</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🤝</span>
                    <div>
                      <p className="text-lg font-bold">{user.books_shared}</p>
                      <p className="text-xs text-old-grey uppercase">Shared</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⭐</span>
                    <div>
                      <p className="text-lg font-bold">{user.total_upvotes || 0}</p>
                      <p className="text-xs text-old-grey uppercase">Upvotes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Score Card */}
          <div className="border-4 border-old-ink bg-gradient-to-br from-old-ink to-gray-800 text-old-paper p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] relative overflow-hidden">
            <div className="absolute top-0 right-0 text-9xl opacity-10">⭐</div>
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-widest opacity-75 mb-2">Success Score</p>
              <p className="text-6xl font-bold mb-2">{user.success_score}</p>
              <div className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 ${
                user.success_score >= 100 ? 'border-green-400 text-green-400' :
                user.success_score >= 50 ? 'border-blue-400 text-blue-400' :
                user.success_score >= 20 ? 'border-yellow-400 text-yellow-400' :
                'border-red-400 text-red-400'
              }`}>
                {scoreStatus.label}
              </div>
            </div>
          </div>
        </div>

        {/* Library Statistics - More Visual */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="border-4 border-old-ink bg-gradient-to-br from-white to-gray-50 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] relative overflow-hidden group hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] transition-all">
            <div className="absolute -bottom-4 -right-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">📚</div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">📚</span>
                <span className="vintage-badge text-xs">Total</span>
              </div>
              <p className="text-5xl font-bold mb-2">{stats.totalBooks}</p>
              <p className="text-sm uppercase tracking-wider text-old-grey">Books in Collection</p>
            </div>
          </div>

          <div className="border-4 border-green-600 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-[4px_4px_0px_0px_rgba(22,163,74,0.3)] relative overflow-hidden group hover:shadow-[6px_6px_0px_0px_rgba(22,163,74,0.4)] transition-all">
            <div className="absolute -bottom-4 -right-4 text-8xl opacity-10 group-hover:opacity-20 transition-opacity">✓</div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">✓</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold uppercase">Available</span>
              </div>
              <p className="text-5xl font-bold mb-2 text-green-700">{stats.availableBooks}</p>
              <p className="text-sm uppercase tracking-wider text-green-800">Ready to Borrow</p>
            </div>
          </div>

          <div className="border-4 border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-[4px_4px_0px_0px_rgba(37,99,235,0.3)] relative overflow-hidden group hover:shadow-[6px_6px_0px_0px_rgba(37,99,235,0.4)] transition-all">
            <div className="absolute -bottom-4 -right-4 text-8xl opacity-10 group-hover:opacity-20 transition-opacity">📖</div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">📖</span>
                <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold uppercase">Active</span>
              </div>
              <p className="text-5xl font-bold mb-2 text-blue-700">{stats.booksReading}</p>
              <p className="text-sm uppercase tracking-wider text-blue-800">In Circulation</p>
            </div>
          </div>
        </div>

        {/* My Book Requests - Compact and Classic */}
        {myRequests.length > 0 && (
          <div className="border-4 border-old-ink bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
            <div className="bg-gradient-to-r from-old-ink to-gray-800 text-old-paper p-3 border-b-4 border-old-ink flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">📬</span>
                <h2 className="text-lg md:text-xl font-bold uppercase tracking-wider">
                  My Book Requests
                </h2>
              </div>
              <span className="px-2 py-1 bg-old-paper text-old-ink text-xs font-bold">
                {myRequests.length}
              </span>
            </div>
            <div className="p-4">
              {/* Table Header - Desktop Only */}
              <div className="hidden md:grid md:grid-cols-12 gap-3 pb-2 mb-3 border-b-2 border-old-border text-xs uppercase tracking-wider text-old-grey font-bold">
                <div className="col-span-5">Book</div>
                <div className="col-span-3">Author</div>
                <div className="col-span-2">Requested</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {/* Book Requests List */}
              <div className="space-y-2">
                {myRequests.map((request: any) => (
                  <div 
                    key={request.id} 
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 border-2 border-old-border hover:border-old-ink transition-all bg-gradient-to-r from-white to-gray-50 items-center"
                  >
                    {/* Book Title */}
                    <div className="md:col-span-5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📕</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold uppercase text-sm truncate">
                            {request.book?.title || 'Unknown Book'}
                          </h3>
                          <span className="vintage-badge text-xs mt-1 inline-block">{request.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Author - Desktop */}
                    <div className="md:col-span-3 hidden md:block">
                      <p className="text-sm text-old-grey truncate">
                        {request.book?.author || 'Unknown Author'}
                      </p>
                    </div>

                    {/* Date - Desktop */}
                    <div className="md:col-span-2 hidden md:block">
                      <p className="text-xs text-old-grey">
                        {new Date(request.requested_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-2 flex gap-2 justify-end">
                      <button 
                        className="px-3 py-1 border-2 border-old-ink bg-white hover:bg-old-ink hover:text-old-paper 
                                 font-bold uppercase text-xs tracking-wider transition-all"
                        onClick={() => router.push(`/books/${request.book_id}`)}
                        title="View book details"
                      >
                        View
                      </button>
                      <button 
                        className="px-3 py-1 border-2 border-red-600 text-red-600 font-bold uppercase text-xs
                                 hover:bg-red-600 hover:text-white transition-all tracking-wider"
                        onClick={() => handleCancelRequest(request.book_id, request.book?.title || 'this book')}
                        title="Cancel request"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Mobile Info */}
                    <div className="md:hidden text-xs text-old-grey flex items-center gap-3">
                      <span>{request.book?.author || 'Unknown Author'}</span>
                      <span>•</span>
                      <span>
                        {new Date(request.requested_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Navigation - More Visual */}
        <div className="border-4 border-old-ink bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
          <div className="bg-gradient-to-r from-old-ink to-gray-800 text-old-paper p-4 border-b-4 border-old-ink">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-center flex items-center justify-center gap-3">
              <span className="text-2xl">🧭</span>
              Quick Navigation
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <NavCard
                icon="📚"
                title="Browse Books"
                description="Explore collection"
                onClick={() => router.push('/books')}
              />
              <NavCard
                icon="📖"
                title="My Library"
                description="Bookmarks & reads"
                onClick={() => router.push('/my-library')}
              />
              <NavCard
                icon="🏆"
                title="Leaderboard"
                description="Top contributors"
                onClick={() => router.push('/leaderboard')}
              />
              <NavCard
                icon="🎁"
                title="Donate"
                description="Support us"
                onClick={() => router.push('/donations')}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function NavCard({ 
  icon, 
  title, 
  description, 
  onClick 
}: { 
  icon: string
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="p-5 border-4 border-old-border hover:border-old-ink hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] 
               transition-all bg-gradient-to-br from-white to-gray-50 group"
    >
      <div className="text-center">
        <div className="text-5xl mb-3 group-hover:scale-125 transition-transform">{icon}</div>
        <p className="font-bold uppercase tracking-wider text-sm mb-1">{title}</p>
        <p className="text-xs text-old-grey">{description}</p>
      </div>
    </button>
  )
}
